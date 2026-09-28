"use client";

import { useState } from "react";
import { Modal } from "@/app/admin/_lib/finance/ui";
import {
  COST_GROUPS,
  COST_HEADS,
  PAYMENT_METHODS,
  type CostGroup,
} from "@/app/admin/_lib/finance/sites-data";
import { useSiteFinance } from "../_lib/SiteFinanceContext";
import { formatMoney } from "@/app/admin/_lib/finance/format";

export default function AddExpenseModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { site, projects, addExpense, period } = useSiteFinance();

  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState<string>(period.to);
  const [group, setGroup] = useState<CostGroup>(COST_GROUPS[0]);
  const [head, setHead] = useState(COST_HEADS[COST_GROUPS[0]][0]);
  const [description, setDescription] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [paidBy, setPaidBy] = useState(site.siteManager);
  const [status, setStatus] = useState<"Approved" | "Pending Approval">("Approved");
  const [receiptNo, setReceiptNo] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  /* Derived rather than synced in an effect: when the site changes, a stored
     project that no longer exists falls back to the site's first project. */
  const effectiveProjectId = projects.some((p) => p.id === projectId)
    ? projectId
    : (projects[0]?.id ?? "");

  const value = Number(amount);
  const activeProject = projects.find((p) => p.id === effectiveProjectId);

  const onGroupChange = (g: CostGroup) => {
    setGroup(g);
    setHead(COST_HEADS[g][0]);
  };

  const reset = () => {
    setDescription("");
    setPaidTo("");
    setAmount("");
    setReceiptNo("");
    setNotes("");
    setError("");
  };

  const submit = () => {
    if (!effectiveProjectId) {
      setError("Select the project this cost belongs to.");
      return;
    }
    if (!value || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!description.trim()) {
      setError("Add a short description of the work or supply.");
      return;
    }
    addExpense({
      projectId: effectiveProjectId,
      date,
      group,
      head,
      description: description.trim(),
      paidTo: paidTo.trim() || "Site Cash",
      amount: value,
      paymentMethod,
      paidBy: paidBy.trim() || site.siteManager,
      status,
      receiptNo: receiptNo.trim() || undefined,
      notes: notes.trim(),
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      width={780}
      title="Record Site Expense"
      subtitle={`${site.name} · ${site.projectCode} · amounts in ${site.currency}`}
      onClose={onClose}
      footer={
        <>
          <button className="fin-btn fin-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="fin-btn fin-btn-primary" onClick={submit}>
            Record expense
          </button>
        </>
      }
    >
      <div className="fin-form">
        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Project</label>
            <select value={effectiveProjectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Expense Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {activeProject && (
          <p className="fin-scope-hint">
            <strong>{activeProject.code}</strong> · {activeProject.scope}
          </p>
        )}

        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Cost Group</label>
            <select value={group} onChange={(e) => onGroupChange(e.target.value as CostGroup)}>
              {COST_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Cost Head</label>
            <select value={head} onChange={(e) => setHead(e.target.value)}>
              {COST_HEADS[group].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="fin-field">
          <label>Description</label>
          <input
            value={description}
            placeholder="e.g. OPC cement 400 bags @ $11.20"
            onChange={(e) => {
              setDescription(e.target.value);
              setError("");
            }}
          />
        </div>

        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Paid To</label>
            <input
              value={paidTo}
              placeholder="Supplier, subcontractor, or Site Cash"
              onChange={(e) => setPaidTo(e.target.value)}
            />
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
            <label>Payment Mode</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Paid By</label>
            <input value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
          </div>
        </div>

        <div className="fin-form-grid">
          <div className="fin-field">
            <label>Bill / Receipt No.</label>
            <input
              value={receiptNo}
              placeholder="Optional"
              onChange={(e) => setReceiptNo(e.target.value)}
            />
          </div>
          <div className="fin-field">
            <label>Approval Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "Approved" | "Pending Approval")}>
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>
        </div>

        <div className="fin-field">
          <label>Notes</label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {value > 0 && activeProject && (
          <p className="fin-prototype-note">
            This will be booked against{" "}
            <strong>
              {activeProject.code} at {formatMoney(value, site.currency)}
            </strong>
            .
          </p>
        )}

        {error && <p className="fin-form-error">{error}</p>}

        <p className="fin-prototype-note">
          Prototype only — this updates local state and is not persisted or sent anywhere.
        </p>
      </div>
    </Modal>
  );
}
