"use client";

import { useState, type FormEvent } from "react";
import {
  BANKS,
  FUNDING_SOURCES,
  OFFICE,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import { nextReference } from "../_lib/OfficeContext";
import { Modal, SectionTitle } from "./ui";

interface FormState {
  date: string;
  amount: string;
  source: string;
  paymentMethod: PaymentMethod;
  bank: string;
  reference: string;
  description: string;
  attachment: string;
  notes: string;
}

const EMPTY: FormState = {
  date: "2026-09-27",
  amount: "",
  source: FUNDING_SOURCES[0],
  paymentMethod: "Bank Transfer",
  bank: BANKS[0],
  reference: "",
  description: "",
  attachment: "",
  notes: "",
};

export default function AddFundsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addFund, toast } = useOffice();
  const [form, setForm] = useState<FormState>(EMPTY);

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const reset = () => {
    setForm(EMPTY);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      toast({ tone: "danger", title: "Invalid amount", message: "Enter a fund amount greater than zero." });
      return;
    }
    addFund({
      id: `F-${Date.now()}`,
      reference: form.reference.trim() || nextReference("OF"),
      date: form.date,
      description: form.description.trim() || "Office Funding",
      amount,
      source: form.source,
      paymentMethod: form.paymentMethod,
      bank: form.bank,
      addedBy: "Accountant",
      status: "Credited",
      notes: form.notes,
      attachment: form.attachment,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add Office Funds"
      subtitle={`${OFFICE.banner} — funds received are tracked separately from expenses`}
      onClose={() => {
        reset();
        onClose();
      }}
      width={780}
      footer={
        <>
          <button
            className="of-btn of-btn-ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
          <button className="of-btn of-btn-primary" onClick={handleSubmit}>
            Save Funds
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="of-form">
        <div className="of-form-callout">
          <strong>Office:</strong> {OFFICE.name} · {OFFICE.line}
          <span className="of-form-callout-hint">
            Opening balance ₹{OFFICE.openingBalance.toLocaleString("en-IN")} is carried forward separately and is not a fund receipt.
          </span>
        </div>

        <div className="of-form-grid">
          <div className="of-field">
            <label>Office</label>
            <input value={OFFICE.name} readOnly className="of-readonly" />
          </div>
          <div className="of-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="of-field">
            <label>Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="2,00,000"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
          </div>
          <div className="of-field">
            <label>Funding Source</label>
            <select value={form.source} onChange={(e) => set("source", e.target.value)}>
              {FUNDING_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => set("paymentMethod", e.target.value as PaymentMethod)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Bank / Account</label>
            <select value={form.bank} onChange={(e) => set("bank", e.target.value)}>
              {BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Reference Number</label>
            <input placeholder="OF-004" value={form.reference} onChange={(e) => set("reference", e.target.value)} />
          </div>
          <div className="of-field">
            <label>Description</label>
            <input
              placeholder="Monthly Office Funding"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="of-field of-field-full">
            <label>Attachment</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => set("attachment", e.target.files?.[0]?.name ?? "")}
            />
            {form.attachment && <small className="of-hint">{form.attachment}</small>}
          </div>
          <div className="of-field of-field-full">
            <label>Notes</label>
            <textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>

        <SectionTitle>Preview</SectionTitle>
        <div className="of-preview-strip">
          <div>
            <span>New Funds Received</span>
            <strong className="of-tone-positive">
              +₹{(Number(form.amount) || 0).toLocaleString("en-IN")}
            </strong>
          </div>
          <div className="of-preview-op">→</div>
          <div>
            <span>Closing Balance after this receipt</span>
            <strong>
              ₹
              {(OFFICE.openingBalance + 850000 + (Number(form.amount) || 0) - 672500).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </form>
    </Modal>
  );
}
