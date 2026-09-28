"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildLedger,
  computeTotals,
  totalsByGroup,
  totalsByProject,
  type CostGroup,
  type LedgerRow,
  type Site,
  type SiteExpense,
  type SiteProject,
  type SiteRemittance,
  type SiteTotals,
} from "@/app/admin/_lib/finance/sites-data";
import { EXPENSES, PERIOD, PROJECTS, REMITTANCES, SITES } from "@/app/admin/_lib/finance/sites-seed";

/* ------------------------------------------------------------------ */
/* Toasts & confirmations                                             */
/* ------------------------------------------------------------------ */

export type ToastTone = "success" | "info";

export interface Toast {
  id: string;
  title: string;
  message: string;
  tone: ToastTone;
}

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
}

export interface ExpenseDraft {
  projectId: string;
  date: string;
  group: CostGroup;
  head: string;
  description: string;
  paidTo: string;
  amount: number;
  paymentMethod: string;
  paidBy: string;
  status: SiteExpense["status"];
  receiptNo?: string;
  notes: string;
}

export interface RemittanceDraft {
  date: string;
  amount: number;
  method: string;
  reference: string;
  remittedBy: string;
  notes: string;
}

interface SiteFinanceValue {
  /* Selection */
  sites: Site[];
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
  site: Site;

  /* Data — local prototype state, mutated in place by the actions below */
  allExpenses: SiteExpense[];
  allRemittances: SiteRemittance[];

  /* Derived for the selected site */
  projects: SiteProject[];
  expenses: SiteExpense[];
  periodExpenses: SiteExpense[];
  priorPeriodExpenses: SiteExpense[];
  remittances: SiteRemittance[];
  periodRemittances: SiteRemittance[];
  ledger: LedgerRow[];
  totals: SiteTotals;
  groupTotals: ReturnType<typeof totalsByGroup>;
  projectTotals: ReturnType<typeof totalsByProject>;
  period: typeof PERIOD;

  /* Actions */
  addExpense: (draft: ExpenseDraft) => void;
  updateExpense: (id: string, patch: Partial<SiteExpense>) => void;
  deleteExpense: (id: string) => void;
  setExpenseStatus: (id: string, status: SiteExpense["status"], approver: string) => void;
  addRemittance: (draft: RemittanceDraft) => void;

  /* UI */
  toasts: Toast[];
  pushToast: (title: string, message: string, tone?: ToastTone) => void;
  dismissToast: (id: string) => void;
  confirm: ConfirmRequest | null;
  setConfirm: (c: ConfirmRequest | null) => void;
}

const SiteFinanceContext = createContext<SiteFinanceValue | null>(null);

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-new-${Date.now().toString(36)}-${idCounter}`;
}

export function SiteFinanceProvider({ children }: { children: ReactNode }) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("gurgaon");
  const [allExpenses, setAllExpenses] = useState<SiteExpense[]>(EXPENSES);
  const [allRemittances, setAllRemittances] = useState<SiteRemittance[]>(REMITTANCES);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  const site = useMemo(
    () => SITES.find((s) => s.id === selectedSiteId) ?? SITES[0],
    [selectedSiteId]
  );

  const projects = useMemo(() => PROJECTS.filter((p) => p.siteId === site.id), [site.id]);

  const expenses = useMemo(
    () => allExpenses.filter((e) => e.siteId === site.id),
    [allExpenses, site.id]
  );

  const remittances = useMemo(
    () => allRemittances.filter((r) => r.siteId === site.id),
    [allRemittances, site.id]
  );

  const inPeriod = useCallback(
    (d: string) => d >= PERIOD.from && d <= PERIOD.to,
    []
  );

  const periodExpenses = useMemo(() => expenses.filter((e) => inPeriod(e.date)), [expenses, inPeriod]);
  const priorPeriodExpenses = useMemo(() => expenses.filter((e) => !inPeriod(e.date)), [expenses, inPeriod]);
  const periodRemittances = useMemo(() => remittances.filter((r) => inPeriod(r.date)), [remittances, inPeriod]);

  const ledger = useMemo(
    () => buildLedger(remittances, expenses, site.openingBalance, site.currency),
    [remittances, expenses, site.openingBalance, site.currency]
  );

  const totals = useMemo(() => computeTotals(site, remittances, expenses), [site, remittances, expenses]);
  const groupTotals = useMemo(() => totalsByGroup(periodExpenses), [periodExpenses]);
  const projectTotals = useMemo(() => totalsByProject(expenses, projects), [expenses, projects]);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    (title: string, message: string, tone: ToastTone = "success") => {
      const id = nextId("toast");
      setToasts((t) => [...t, { id, title, message, tone }]);
      setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  const addExpense = useCallback(
    (draft: ExpenseDraft) => {
      const record: SiteExpense = {
        ...draft,
        id: nextId("sx"),
        siteId: site.id,
        currency: site.currency,
        receiptNo: draft.receiptNo?.trim() || `RCP-${Date.now().toString().slice(-6)}`,
        approvedBy: draft.status === "Approved" ? "Site Manager" : undefined,
        approvedOn: draft.status === "Approved" ? draft.date : undefined,
      };
      setAllExpenses((prev) => [record, ...prev]);
      pushToast(
        "Expense recorded",
        `${record.head} · ${record.currency === "INR" ? "₹" : "$"}${record.amount.toLocaleString("en-IN")} added to ${site.name}.`
      );
    },
    [site, pushToast]
  );

  const updateExpense = useCallback(
    (id: string, patch: Partial<SiteExpense>) => {
      setAllExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
      pushToast("Expense updated", "Changes saved to local prototype state.");
    },
    [pushToast]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setAllExpenses((prev) => prev.filter((e) => e.id !== id));
      pushToast("Expense deleted", "The entry was removed from the site register.", "info");
    },
    [pushToast]
  );

  const setExpenseStatus = useCallback(
    (id: string, status: SiteExpense["status"], approver: string) => {
      setAllExpenses((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                status,
                approvedBy: status === "Approved" ? approver : undefined,
                approvedOn: status === "Approved" ? new Date().toISOString().slice(0, 10) : undefined,
              }
            : e
        )
      );
      pushToast(
        status === "Approved" ? "Expense approved" : "Expense rejected",
        `Marked as ${status} by ${approver}.`
      );
    },
    [pushToast]
  );

  const addRemittance = useCallback(
    (draft: RemittanceDraft) => {
      const record: SiteRemittance = {
        ...draft,
        id: nextId("sr"),
        siteId: site.id,
        currency: site.currency,
      };
      setAllRemittances((prev) => [...prev, record]);
      pushToast(
        "Remittance recorded",
        `${record.currency === "INR" ? "₹" : "$"}${record.amount.toLocaleString("en-IN")} sent to ${site.name} via ${record.method}.`
      );
    },
    [site, pushToast]
  );

  const value: SiteFinanceValue = {
    sites: SITES,
    selectedSiteId,
    setSelectedSiteId,
    site,
    allExpenses,
    allRemittances,
    projects,
    expenses,
    periodExpenses,
    priorPeriodExpenses,
    remittances,
    periodRemittances,
    ledger,
    totals,
    groupTotals,
    projectTotals,
    period: PERIOD,
    addExpense,
    updateExpense,
    deleteExpense,
    setExpenseStatus,
    addRemittance,
    toasts,
    pushToast,
    dismissToast,
    confirm,
    setConfirm,
  };

  return <SiteFinanceContext.Provider value={value}>{children}</SiteFinanceContext.Provider>;
}

export function useSiteFinance(): SiteFinanceValue {
  const ctx = useContext(SiteFinanceContext);
  if (!ctx) throw new Error("useSiteFinance must be used within a SiteFinanceProvider");
  return ctx;
}
