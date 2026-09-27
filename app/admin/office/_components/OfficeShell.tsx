"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useOffice } from "../_lib/OfficeContext";
import AddAssetModal from "./AddAssetModal";
import AddExpenseModal from "./AddExpenseModal";
import AddFundsModal from "./AddFundsModal";
import AddPettyCashModal from "./AddPettyCashModal";
import AddRequestModal from "./AddRequestModal";
import AddVendorModal from "./AddVendorModal";
import { ConfirmDialog, IconCheck, IconClose, IconWallet } from "./ui";

type ModalKey =
  | "funds"
  | "expense"
  | "pettyCash"
  | "request"
  | "vendor"
  | "asset"
  | null;

interface OfficeUIValue {
  open: (m: Exclude<ModalKey, null>) => void;
  close: () => void;
}

const OfficeUIContext = createContext<OfficeUIValue | null>(null);

export function useOfficeUI() {
  const ctx = useContext(OfficeUIContext);
  if (!ctx) throw new Error("useOfficeUI must be used inside OfficeShell");
  return ctx;
}

export function OfficeShell({ children }: { children: ReactNode }) {
  const { toasts, dismissToast, confirm, setConfirm } = useOffice();
  const [modal, setModal] = useState<ModalKey>(null);

  const close = () => setModal(null);

  return (
    <OfficeUIContext.Provider value={{ open: setModal, close }}>
      {children}

      <AddFundsModal open={modal === "funds"} onClose={close} />
      <AddExpenseModal open={modal === "expense"} onClose={close} />
      <AddPettyCashModal open={modal === "pettyCash"} onClose={close} />
      <AddRequestModal open={modal === "request"} onClose={close} />
      <AddVendorModal open={modal === "vendor"} onClose={close} />
      <AddAssetModal open={modal === "asset"} onClose={close} />

      {confirm && (
        <ConfirmDialog
          open
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel={confirm.cancelLabel ?? "Cancel"}
          tone={confirm.tone}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm.onConfirm();
            setConfirm(null);
          }}
        />
      )}

      <div className="of-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`of-toast of-toast-${t.tone}`}>
            <span className="of-toast-icon">
              {t.tone === "success" ? <IconCheck size={16} /> : <IconWallet size={16} />}
            </span>
            <div className="of-toast-body">
              <strong>{t.title}</strong>
              <p>{t.message}</p>
            </div>
            <button className="of-toast-close" onClick={() => dismissToast(t.id)} aria-label="Dismiss">
              <IconClose size={14} />
            </button>
          </div>
        ))}
      </div>
    </OfficeUIContext.Provider>
  );
}
