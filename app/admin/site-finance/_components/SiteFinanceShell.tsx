"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSiteFinance } from "../_lib/SiteFinanceContext";
import AddExpenseModal from "./AddExpenseModal";
import AddRemittanceModal from "./AddRemittanceModal";
import ExpenseDrawer from "./ExpenseDrawer";
import { ConfirmDialog, IconCheck, IconClose, IconWallet } from "@/app/admin/_lib/finance/ui";

type ModalKey = "remittance" | "expense" | null;

interface SiteFinanceUIValue {
  open: (m: Exclude<ModalKey, null>) => void;
  close: () => void;
  /** Open the read-only detail drawer for one expense row. */
  openExpense: (id: string) => void;
}

const SiteFinanceUIContext = createContext<SiteFinanceUIValue | null>(null);

export function useSiteFinanceUI() {
  const ctx = useContext(SiteFinanceUIContext);
  if (!ctx) throw new Error("useSiteFinanceUI must be used inside SiteFinanceShell");
  return ctx;
}

export function SiteFinanceShell({ children }: { children: ReactNode }) {
  const { toasts, dismissToast, confirm, setConfirm } = useSiteFinance();
  const [modal, setModal] = useState<ModalKey>(null);
  const [drawerExpenseId, setDrawerExpenseId] = useState<string | null>(null);

  const close = () => setModal(null);

  return (
    <SiteFinanceUIContext.Provider
      value={{ open: setModal, close, openExpense: setDrawerExpenseId }}
    >
      {children}

      <AddRemittanceModal open={modal === "remittance"} onClose={close} />
      <AddExpenseModal open={modal === "expense"} onClose={close} />
      <ExpenseDrawer expenseId={drawerExpenseId} onClose={() => setDrawerExpenseId(null)} />

      {confirm && (
        <ConfirmDialog
          open
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel ?? "Confirm"}
          cancelLabel={confirm.cancelLabel ?? "Cancel"}
          tone={confirm.tone ?? "primary"}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm.onConfirm();
            setConfirm(null);
          }}
        />
      )}

      <div className="fin-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`fin-toast fin-toast-${t.tone}`}>
            <span className="fin-toast-icon">
              {t.tone === "success" ? <IconCheck size={16} /> : <IconWallet size={16} />}
            </span>
            <div className="fin-toast-body">
              <strong>{t.title}</strong>
              <p>{t.message}</p>
            </div>
            <button className="fin-toast-close" onClick={() => dismissToast(t.id)} aria-label="Dismiss">
              <IconClose size={14} />
            </button>
          </div>
        ))}
      </div>
    </SiteFinanceUIContext.Provider>
  );
}
