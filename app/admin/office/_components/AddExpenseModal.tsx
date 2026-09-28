"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  DEPARTMENTS,
  EXPENSE_CATEGORY_GROUPS,
  EXPENSE_STATUSES,
  OFFICE,
  PAYMENT_METHODS,
  STAFF,
  type Department,
  type ExpenseStatus,
  type PaymentMethod,
} from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import { Modal, SectionTitle } from "@/app/admin/_lib/finance/ui";

interface FormState {
  date: string;
  category: string;
  subcategory: string;
  description: string;
  amount: string;
  paymentMethod: PaymentMethod;
  paidBy: string;
  department: Department;
  vendor: string;
  receipt: string;
  notes: string;
  status: ExpenseStatus;
}

const EMPTY: FormState = {
  date: "2026-09-27",
  category: "Office Administration",
  subcategory: EXPENSE_CATEGORY_GROUPS["Office Administration"][0],
  description: "",
  amount: "",
  paymentMethod: "Cash",
  paidBy: "Accountant",
  department: "Administration",
  vendor: "",
  receipt: "",
  notes: "",
  status: "Draft",
};

export default function AddExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addExpense, vendors, toast, expenses } = useOffice();
  const [form, setForm] = useState<FormState>(EMPTY);

  const subcategories = useMemo(
    () => EXPENSE_CATEGORY_GROUPS[form.category] ?? [],
    [form.category]
  );

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));

  const reset = () => setForm(EMPTY);

  const nextId = useMemo(() => {
    const max = expenses.reduce((m, e) => {
      const n = Number(e.id.replace("EXP-", ""));
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 1000);
    return `EXP-${max + 1}`;
  }, [expenses]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      toast({ tone: "danger", title: "Invalid amount", message: "Enter an expense amount greater than zero." });
      return;
    }
    addExpense({
      id: nextId,
      date: form.date,
      category: form.category,
      subcategory: form.subcategory,
      description: form.description.trim() || form.subcategory,
      department: form.department,
      amount,
      status: form.status,
      paymentMethod: form.paymentMethod,
      paidBy: form.paidBy,
      vendor: form.vendor.trim() || "—",
      receipt: form.receipt,
      notes: form.notes,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add Office Expense"
      subtitle={`${OFFICE.banner} — office finance only, site expenses are excluded`}
      onClose={() => {
        reset();
        onClose();
      }}
      width={840}
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
            Save Expense
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="fin-form">
        <div className="fin-form-callout">
          Reference <strong>{nextId}</strong> · {OFFICE.name}
          <span className="fin-form-callout-hint">
            Expense categories are configurable in the backend. Site / construction costs are recorded under Construction → Sites.
          </span>
        </div>

        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="fin-field">
            <label>Expense Category</label>
            <select
              value={form.category}
              onChange={(e) => {
                const cat = e.target.value;
                setForm((p) => ({
                  ...p,
                  category: cat,
                  subcategory: EXPENSE_CATEGORY_GROUPS[cat]?.[0] ?? "",
                }));
              }}
            >
              {Object.keys(EXPENSE_CATEGORY_GROUPS).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Subcategory</label>
            <select value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)}>
              {subcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Description</label>
            <input
              placeholder="Monthly Internet"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="fin-field">
            <label>Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="2,500"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
          </div>
          <div className="fin-field">
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
          <div className="fin-field">
            <label>Paid By</label>
            <select value={form.paidBy} onChange={(e) => set("paidBy", e.target.value)}>
              {STAFF.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Department</label>
            <select value={form.department} onChange={(e) => set("department", e.target.value as Department)}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Vendor</label>
            <input
              list="fin-vendor-options"
              placeholder="Select or type a vendor"
              value={form.vendor}
              onChange={(e) => set("vendor", e.target.value)}
            />
            <datalist id="fin-vendor-options">
              {vendors.map((v) => (
                <option key={v.id} value={v.name} />
              ))}
            </datalist>
          </div>
          <div className="fin-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as ExpenseStatus)}>
              {EXPENSE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Receipt</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => set("receipt", e.target.files?.[0]?.name ?? "")}
            />
            {form.receipt && <small className="fin-hint">{form.receipt}</small>}
          </div>
          <div className="fin-field fin-field-full">
            <label>Notes</label>
            <textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>

        <SectionTitle>Balance Impact</SectionTitle>
        <div className="fin-preview-strip">
          <div>
            <span>This Expense</span>
            <strong className="fin-tone-negative">−₹{(Number(form.amount) || 0).toLocaleString("en-IN")}</strong>
          </div>
          <div className="fin-preview-op">→</div>
          <div>
            <span>Status</span>
            <strong>{form.status}</strong>
          </div>
          <div className="fin-preview-op">→</div>
          <div>
            <span>Counted in closing balance</span>
            <strong>{form.status === "Draft" ? "No — on save it still reduces the ledger" : "Yes"}</strong>
          </div>
        </div>
      </form>
    </Modal>
  );
}
