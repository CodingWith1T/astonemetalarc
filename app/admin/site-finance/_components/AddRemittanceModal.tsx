"use client";

import { useState } from "react";
import { Modal } from "@/app/admin/_lib/finance/ui";
import { REMITTANCE_METHODS } from "@/app/admin/_lib/finance/sites-data";
import { useSiteFinance } from "../_lib/SiteFinanceContext";
import { formatMoney } from "@/app/admin/_lib/finance/format";

export default function AddRemittanceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { site, addRemittance, totals, period } = useSiteFinance();
  const [date, setDate] = useState<string>(period.to);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>(REMITTANCE_METHODS[0]);
  const [reference, setReference] = useState("");
  const [remittedBy, setRemittedBy] = useState("Head Office — Accounts");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const value = Number(amount);
  const projected = totals.closingBalance + (Number.isFinite(value) ? value : 0);

  const reset = () => {
    setAmount("");
    setReference("");
    setNotes("");
    setError("");
  };

  const submit = () => {
    if (!value || value <= 0) {
      setError("Enter a remittance amount greater than zero.");
      return;
    }
    addRemittance({
      date,
      amount: value,
      method,
      reference: reference.trim() || `TRX-${Date.now().toString().slice(-6)}`,
      remittedBy: remittedBy.trim() || "Head Office — Accounts",
      notes: notes.trim(),
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Record Site Remittance"
      subtitle={`Funds sent from Head Office to ${site.name} · ${site.projectCode}`}
      onClose={onClose}
      footer={
        <>
          <button className="fin-btn fin-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="fin-btn fin-btn-primary" onClick={submit}>
            Record remittance
          </button>
        </>
      }
    >
      <div className="fin-form">
        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Remittance Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="fin-field">
            <label>Amount ({site.currency})</label>
            <input
              type="number"
              min={0}
              value={amount}
              placeholder="0"
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
            />
          </div>
        </div>

        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Transfer Mode</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              {REMITTANCE_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Reference / UTR No.</label>
            <input
              value={reference}
              placeholder="e.g. NEFT-41220"
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>

        <div className="fin-field">
          <label>Remitted By</label>
          <input value={remittedBy} onChange={(e) => setRemittedBy(e.target.value)} />
        </div>

        <div className="fin-field">
          <label>Notes / Milestone Reference</label>
          <textarea
            rows={3}
            value={notes}
            placeholder="Against running bill, milestone, or material tranche"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="fin-callout">
          <div>
            <span>Current site balance</span>
            <strong>{formatMoney(totals.closingBalance, site.currency)}</strong>
          </div>
          <div className="fin-callout-arrow">→</div>
          <div>
            <span>Balance after this remittance</span>
            <strong>{formatMoney(projected, site.currency)}</strong>
          </div>
        </div>

        {error && <p className="fin-form-error">{error}</p>}

        <p className="fin-prototype-note">
          Prototype only — this updates local state and is not persisted or sent anywhere.
        </p>
      </div>
    </Modal>
  );
}
