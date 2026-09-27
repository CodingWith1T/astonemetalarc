"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_ASSETS,
  INITIAL_EXPENSES,
  INITIAL_FUNDS,
  INITIAL_PETTY_CASH,
  INITIAL_REQUESTS,
  INITIAL_VENDORS,
  OFFICE,
  OPENING_FUNDS,
  OPENING_PETTY_CASH,
  isPendingStatus,
  type OfficeAsset,
  type OfficeExpense,
  type OfficeFund,
  type OfficeRequest,
  type OfficeVendor,
  type PettyCashEntry,
  type RequestStatus,
} from "./office-data";

export interface Toast {
  id: number;
  tone: "success" | "info" | "warning" | "danger";
  title: string;
  message: string;
}

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone: "primary" | "danger";
  onConfirm: () => void;
}

export interface PettyCashRow extends PettyCashEntry {
  balance: number;
}

export interface LedgerRow {
  id: string;
  date: string;
  transaction: "Opening" | "Funding" | "Expense" | "Petty Cash" | "Adjustment";
  description: string;
  reference: string;
  moneyIn: number;
  moneyOut: number;
  balance: number;
  sourceId: string;
}

interface OfficeContextValue {
  funds: OfficeFund[];
  expenses: OfficeExpense[];
  pettyCash: PettyCashRow[];
  requests: OfficeRequest[];
  vendors: OfficeVendor[];
  assets: OfficeAsset[];

  totalFundsReceived: number;
  openingBalance: number;
  totalAvailableFunds: number;
  totalExpenses: number;
  approvedExpenses: number;
  pendingExpenses: number;
  closingBalance: number;
  expenseCount: number;

  pettyCashOpening: number;
  pettyCashAdded: number;
  pettyCashSpent: number;
  pettyCashBalance: number;

  pendingApprovals: number;
  pendingPayables: number;

  ledger: LedgerRow[];
  recentTransactions: LedgerRow[];

  addFund: (fund: OfficeFund) => void;
  addExpense: (expense: OfficeExpense) => void;
  updateExpense: (expense: OfficeExpense) => void;
  deleteExpense: (id: string) => void;
  addPettyCash: (entry: PettyCashEntry) => void;
  addRequest: (request: OfficeRequest) => void;
  addVendor: (vendor: OfficeVendor) => void;
  addAsset: (asset: OfficeAsset) => void;
  setRequestStatus: (id: string, status: RequestStatus) => void;
  setExpenseStatus: (id: string, status: OfficeExpense["status"]) => void;

  toast: (t: Omit<Toast, "id">) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;

  confirm: ConfirmConfig | null;
  setConfirm: (c: ConfirmConfig | null) => void;
}

const OfficeContext = createContext<OfficeContextValue | null>(null);

let toastSeq = 0;
let refSeq = 100;

export function OfficeProvider({ children }: { children: ReactNode }) {
  const [funds, setFunds] = useState<OfficeFund[]>(() => [...OPENING_FUNDS, ...INITIAL_FUNDS]);
  const [expenses, setExpenses] = useState<OfficeExpense[]>(INITIAL_EXPENSES);
  const [pettyCashRaw, setPettyCashRaw] = useState<PettyCashEntry[]>(() => [
    ...OPENING_PETTY_CASH,
    ...INITIAL_PETTY_CASH,
  ]);
  const [requests, setRequests] = useState<OfficeRequest[]>(INITIAL_REQUESTS);
  const [vendors, setVendors] = useState<OfficeVendor[]>(INITIAL_VENDORS);
  const [assets, setAssets] = useState<OfficeAsset[]>(INITIAL_ASSETS);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastSeq;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  /* ---------------- Financial computation ---------------- */

  const openingBalance = OFFICE.openingBalance;

  const totalFundsReceived = useMemo(
    () => funds.filter((f) => f.source !== "Carried Forward").reduce((s, f) => s + f.amount, 0),
    [funds]
  );

  const totalAvailableFunds = openingBalance + totalFundsReceived;

  const totalExpenses = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const approvedExpenses = useMemo(
    () => expenses.filter((e) => e.status === "Approved" || e.status === "Paid").reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const pendingExpenses = useMemo(
    () => expenses.filter((e) => isPendingStatus(e.status)).reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const closingBalance = totalAvailableFunds - totalExpenses;

  const pettyCash = useMemo<PettyCashRow[]>(() => {
    const state = { bal: 0 };
    return [...pettyCashRaw]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => ({ ...entry, balance: (state.bal += entry.cashIn - entry.cashOut) }));
  }, [pettyCashRaw]);

  const pettyCashOpening = pettyCash.length ? pettyCash[0].balance : 0;
  const pettyCashAdded = pettyCash.reduce((s, p) => s + p.cashIn, 0);
  const pettyCashSpent = pettyCash.reduce((s, p) => s + p.cashOut, 0);
  const pettyCashBalance = pettyCash.length ? pettyCash[pettyCash.length - 1].balance : 0;

  const ledger = useMemo<LedgerRow[]>(() => {
    const rows: LedgerRow[] = [
      {
        id: "L-000",
        date: "2026-09-01",
        transaction: "Opening",
        description: "Opening Balance (carried forward from August)",
        reference: "OPENING",
        moneyIn: 0,
        moneyOut: 0,
        balance: 0,
        sourceId: "F-000",
      },
    ];

    funds
      .filter((f) => f.source !== "Carried Forward")
      .forEach((f) =>
        rows.push({
          id: `L-${f.id}`,
          date: f.date,
          transaction: "Funding",
          description: f.description,
          reference: f.reference,
          moneyIn: f.amount,
          moneyOut: 0,
          balance: 0,
          sourceId: f.id,
        })
      );

    expenses.forEach((e) =>
      rows.push({
        id: `L-${e.id}`,
        date: e.date,
        transaction: "Expense",
        description: `${e.category} — ${e.description}`,
        reference: e.id,
        moneyIn: 0,
        moneyOut: e.amount,
        balance: 0,
        sourceId: e.id,
      })
    );

    rows.sort((a, b) => a.date.localeCompare(b.date));

    const state = { bal: 0 };
    return rows.map((r) => ({ ...r, balance: (state.bal += r.moneyIn - r.moneyOut) }));
  }, [funds, expenses]);

  const recentTransactions = useMemo(() => [...ledger].reverse().slice(0, 6), [ledger]);

  const pendingApprovals = useMemo(
    () =>
      expenses.filter((e) => e.status === "Pending Approval").length +
      requests.filter((r) => r.status === "Pending Approval").length,
    [expenses, requests]
  );

  const pendingPayables = useMemo(() => {
    const pendingExpenseTotal = expenses
      .filter((e) => e.status === "Pending Approval")
      .reduce((s, e) => s + e.amount, 0);
    const vendorOutstanding = vendors.reduce((s, v) => s + outstandingOf(v), 0);
    return pendingExpenseTotal + vendorOutstanding;
  }, [expenses, vendors]);

  /* ---------------- Actions ---------------- */

  const addFund = useCallback(
    (fund: OfficeFund) => {
      setFunds((prev) => [...prev, fund]);
      toast({
        tone: "success",
        title: "Funds added",
        message: `${fund.reference} · ₹${fund.amount.toLocaleString("en-IN")} credited to office account.`,
      });
    },
    [toast]
  );

  const addExpense = useCallback(
    (expense: OfficeExpense) => {
      setExpenses((prev) => [expense, ...prev]);
      toast({
        tone: "success",
        title: "Expense saved",
        message: `${expense.id} · ${expense.description} · ₹${expense.amount.toLocaleString("en-IN")}`,
      });
    },
    [toast]
  );

  const updateExpense = useCallback(
    (expense: OfficeExpense) => {
      setExpenses((prev) => prev.map((x) => (x.id === expense.id ? expense : x)));
      toast({
        tone: "info",
        title: "Expense updated",
        message: `${expense.id} changes saved to the office ledger.`,
      });
    },
    [toast]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((x) => x.id !== id));
      toast({ tone: "warning", title: "Expense deleted", message: `${id} removed from the office ledger.` });
    },
    [toast]
  );

  const addPettyCash = useCallback(
    (entry: PettyCashEntry) => {
      setPettyCashRaw((prev) => [...prev, entry]);
      toast({
        tone: "success",
        title: entry.cashIn ? "Petty cash added" : "Petty cash spent",
        message: `${entry.reference} · ₹${(entry.cashIn || entry.cashOut).toLocaleString("en-IN")}`,
      });
    },
    [toast]
  );

  const addRequest = useCallback(
    (request: OfficeRequest) => {
      setRequests((prev) => [request, ...prev]);
      toast({
        tone: "success",
        title: "Request submitted",
        message: `${request.id} · ${request.item} · awaiting approval.`,
      });
    },
    [toast]
  );

  const addVendor = useCallback(
    (vendor: OfficeVendor) => {
      setVendors((prev) => [vendor, ...prev]);
      toast({ tone: "success", title: "Vendor added", message: `${vendor.name} added to the vendor register.` });
    },
    [toast]
  );

  const addAsset = useCallback(
    (asset: OfficeAsset) => {
      setAssets((prev) => [asset, ...prev]);
      toast({ tone: "success", title: "Asset added", message: `${asset.assetId} · ${asset.name}` });
    },
    [toast]
  );

  const setRequestStatus = useCallback(
    (id: string, status: RequestStatus) => {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast({
        tone: status === "Rejected" ? "danger" : "success",
        title: `Request ${status}`,
        message: `${id} marked as ${status}.`,
      });
    },
    [toast]
  );

  const setExpenseStatus = useCallback(
    (id: string, status: OfficeExpense["status"]) => {
      setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
      toast({
        tone: status === "Rejected" ? "danger" : "success",
        title: `Expense ${status}`,
        message: `${id} marked as ${status}.`,
      });
    },
    [toast]
  );

  const value: OfficeContextValue = {
    funds,
    expenses,
    pettyCash,
    requests,
    vendors,
    assets,
    totalFundsReceived,
    openingBalance,
    totalAvailableFunds,
    totalExpenses,
    approvedExpenses,
    pendingExpenses,
    closingBalance,
    expenseCount: expenses.length,
    pettyCashOpening,
    pettyCashAdded,
    pettyCashSpent,
    pettyCashBalance,
    pendingApprovals,
    pendingPayables,
    ledger,
    recentTransactions,
    addFund,
    addExpense,
    updateExpense,
    deleteExpense,
    addPettyCash,
    addRequest,
    addVendor,
    addAsset,
    setRequestStatus,
    setExpenseStatus,
    toast,
    toasts,
    dismissToast,
    confirm,
    setConfirm,
  };

  return <OfficeContext.Provider value={value}>{children}</OfficeContext.Provider>;
}

export function outstandingOf(vendor: OfficeVendor): number {
  const paid = vendor.transactions.filter((t) => t.mode === "Bank Transfer" || t.mode === "Cheque").reduce((s, t) => s + t.amount, 0);
  const cash = vendor.transactions.filter((t) => t.mode === "Cash" || t.mode === "UPI").reduce((s, t) => s + t.amount, 0);
  return Math.max(0, Math.round((paid * 0.35) - cash));
}

export function nextReference(prefix: string): string {
  refSeq += 1;
  return `${prefix}-${refSeq}`;
}

export function useOffice() {
  const ctx = useContext(OfficeContext);
  if (!ctx) throw new Error("useOffice must be used within an OfficeProvider");
  return ctx;
}
