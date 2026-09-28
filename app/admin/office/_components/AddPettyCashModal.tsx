"use client";

import { useState, type FormEvent } from "react";
import { OFFICE, STAFF, type PettyCashEntry } from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import { Modal, SectionTitle } from "@/app/admin/_lib/finance/ui";

const CATEGORIES = [
  "Stationery",
  "Office Supplies",
  "Printing",
  "Local Transportation",
  "Toll",
  "Cleaning",
  "Maintenance",
  "Other",
  "Cash Added",
];

export default function AddPettyCashModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addPettyCash, pettyCashBalance, toast } = useOffice();
  const [mode, setMode] = useState<"in" | "out">("out");
  const [form, setForm] = useState({
    date: "2026-09-27",
    description: "",
    category: "Stationery",
    amount: "",
    addedBy: "Admin Executive",
    reference: "",
  });

  const reset = () =>
    setForm({
      date: "2026-09-27",
      description: "",
      category: "Stationery",
      amount: "",
      addedBy: "Admin Executive",
      reference: "",
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      toast({ tone: "danger", title: "Invalid amount", message: "Enter a cash amount greater than zero." });
      return;
    }
    if (mode === "out" && amount > pettyCashBalance) {
      toast({
        tone: "warning",
        title: "Insufficient petty cash",
        message: `Available balance is ₹${pettyCashBalance.toLocaleString("en-IN")}.`,
      });
      return;
    }
    const entry: PettyCashEntry = {
      id: `PC-${Date.now()}`,
      date: form.date,
      description: form.description.trim() || (mode === "in" ? "Petty Cash Top-up" : "Petty Cash Voucher"),
      category: form.category,
      cashIn: mode === "in" ? amount : 0,
      cashOut: mode === "out" ? amount : 0,
      addedBy: form.addedBy,
      reference: form.reference.trim() || `PV-${1500 + Math.floor(Math.random() * 90)}`,
    };
    addPettyCash(entry);
    reset();
    onClose();
  };

  const amount = Number(form.amount) || 0;

  return (
    <Modal
      open={open}
      title="Add Cash Transaction"
      subtitle={`${OFFICE.banner} — petty cash float, tracked separately from bank funds`}
      onClose={() => {
        reset();
        onClose();
      }}
      width={640}
      footer={
        <>
          <button
            className="fin-btn fin-btn-ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
          <button className="fin-btn fin-btn-primary" onClick={handleSubmit}>
            Save Transaction
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="fin-form">
        <div className="fin-segmented">
          <button
            type="button"
            className={`fin-seg${mode === "out" ? " active" : ""}`}
            onClick={() => setMode("out")}
          >
            Cash Out
          </button>
          <button
            type="button"
            className={`fin-seg${mode === "in" ? " active" : ""}`}
            onClick={() => setMode("in")}
          >
            Cash In
          </button>
        </div>

        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="fin-field">
            <label>Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="1,250"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="fin-field">
            <label>Description</label>
            <input
              placeholder="Postage & Courier"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="fin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Added By</label>
            <select value={form.addedBy} onChange={(e) => setForm({ ...form, addedBy: e.target.value })}>
              {STAFF.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Voucher Reference</label>
            <input
              placeholder="PV-0154"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
            />
          </div>
        </div>

        <SectionTitle>Running Balance</SectionTitle>
        <div className="fin-preview-strip">
          <div>
            <span>Current Cash Balance</span>
            <strong>₹{pettyCashBalance.toLocaleString("en-IN")}</strong>
          </div>
          <div className="fin-preview-op">
            {mode === "in" ? "+" : "−"}
          </div>
          <div>
            <span>This Transaction</span>
            <strong className={mode === "in" ? "fin-tone-positive" : "fin-tone-negative"}>
              ₹{amount.toLocaleString("en-IN")}
            </strong>
          </div>
          <div className="fin-preview-op">=</div>
          <div>
            <span>New Cash Balance</span>
            <strong>
              ₹{(mode === "in" ? pettyCashBalance + amount : pettyCashBalance - amount).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </form>
    </Modal>
  );
}
