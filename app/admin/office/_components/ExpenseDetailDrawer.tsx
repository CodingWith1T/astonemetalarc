"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  OFFICE,
  buildAuditTrail,
  formatDate,
  type AuditEvent,
  type OfficeExpense,
} from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import {
  ConfirmDialog,
  DetailRow,
  Drawer,
  IconEdit,
  IconFile,
  IconHistory,
  IconShield,
  IconTrash,
  SectionTitle,
  StatusBadge,
} from "./ui";

export default function ExpenseDetailDrawer({
  expense,
  onClose,
}: {
  expense: OfficeExpense | null;
  onClose: () => void;
}) {
  const { deleteExpense, setExpenseStatus, toast } = useOffice();
  const [tab, setTab] = useState<"details" | "approval" | "audit">("details");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const router = useRouter();

  if (!expense) return null;

  const audit: AuditEvent[] = buildAuditTrail(expense, "expense");

  return (
    <>
      <Drawer
        open={!!expense}
        title={`Expense #${expense.id}`}
        subtitle={`${expense.category} · ${formatDate(expense.date)}`}
        onClose={onClose}
        footer={
          <div className="of-drawer-actions">
            <button className="of-btn of-btn-ghost" onClick={() => toast({ tone: "info", title: "Edit mode", message: "Inline editing will be available in the next iteration." })}>
              <IconEdit size={15} /> Edit
            </button>
            <button className="of-btn of-btn-ghost" onClick={() => toast({ tone: "info", title: "Receipt preview", message: "Receipt viewer placeholder — backend storage will be added." })}>
              <IconFile size={15} /> View Receipt
            </button>
            {expense.status === "Pending Approval" && (
              <button className="of-btn of-btn-primary" onClick={() => setConfirmApprove(true)}>
                <IconShield size={15} /> Approve
              </button>
            )}
            <button className="of-btn of-btn-danger-ghost" onClick={() => setConfirmDelete(true)}>
              <IconTrash size={15} /> Delete
            </button>
          </div>
        }
      >
        <div className="of-drawer-hero">
          <div>
            <span className="of-drawer-hero-label">Amount</span>
            <strong className="of-drawer-hero-amount">₹{expense.amount.toLocaleString("en-IN")}</strong>
          </div>
          <StatusBadge status={expense.status} />
        </div>

        <div className="of-tabs">
          {(["details", "approval", "audit"] as const).map((t) => (
            <button
              key={t}
              className={`of-tab${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "details" ? "Details" : t === "approval" ? "Approval History" : "Audit Log"}
            </button>
          ))}
        </div>

        {tab === "details" && (
          <>
            <SectionTitle>Transaction</SectionTitle>
            <div className="of-detail-list">
              <DetailRow label="Office" value={`${OFFICE.shortName} — ${OFFICE.line}`} />
              <DetailRow label="Date" value={formatDate(expense.date)} />
              <DetailRow label="Expense ID" value={expense.id} />
              <DetailRow label="Category" value={expense.category} />
              <DetailRow label="Subcategory" value={expense.subcategory} />
              <DetailRow label="Description" value={expense.description} />
              <DetailRow label="Amount" value={`₹${expense.amount.toLocaleString("en-IN")}`} tone="negative" />
              <DetailRow label="Payment Method" value={expense.paymentMethod} />
              <DetailRow label="Department" value={expense.department} />
              <DetailRow label="Vendor" value={expense.vendor} />
              <DetailRow label="Paid By" value={expense.paidBy} />
              <DetailRow label="Status" value={<StatusBadge status={expense.status} />} />
              <DetailRow
                label="Receipt"
                value={
                  expense.receipt ? (
                    <span className="of-file-chip">
                      <IconFile size={13} /> {expense.receipt}
                    </span>
                  ) : (
                    "Not uploaded"
                  )
                }
              />
              <DetailRow label="Notes" value={expense.notes || "—"} />
            </div>

            <div className="of-note">
              This expense belongs to <strong>Office Finance (Ghaziabad)</strong>. It is never combined with
              construction site finance in a balance calculation.
            </div>
          </>
        )}

        {tab === "approval" && (
          <>
            <SectionTitle>Approval History</SectionTitle>
            <div className="of-approval-track">
              {audit.map((step, i) => (
                <div key={i} className={`of-approval-step of-approval-${step.tone}`}>
                  <span className="of-approval-dot" />
                  <div>
                    <strong>{step.action}</strong>
                    <span className="of-approval-when">{step.dateTime}</span>
                    <span className="of-approval-by">{step.by}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="of-note">
              Mock audit data for UI demonstration. Full approval history will be persisted per transaction.
            </div>
          </>
        )}

        {tab === "audit" && (
          <>
            <SectionTitle
              action={
                <button className="of-link-btn" onClick={() => toast({ tone: "info", title: "Export log", message: "Audit log export will be available with the backend." })}>
                  <IconHistory size={14} /> Export log
                </button>
              }
            >
              Audit Log
            </SectionTitle>
            <div className="of-timeline">
              {audit.map((step, i) => (
                <div key={i} className="of-timeline-item">
                  <span className={`of-timeline-dot of-timeline-${step.tone}`} />
                  <div className="of-timeline-body">
                    <div className="of-timeline-head">
                      <strong>{step.action}</strong>
                      <span>{step.dateTime}</span>
                    </div>
                    <p>{step.note}</p>
                    <small>by {step.by}</small>
                  </div>
                </div>
              ))}
            </div>
            <button className="of-btn of-btn-ghost of-btn-block" onClick={() => router.push("/admin/office/expenses")}>
              View all office expenses
            </button>
          </>
        )}
      </Drawer>

      <ConfirmDialog
        open={confirmApprove}
        title="Approve expense?"
        message={`Approve ${expense.id} for ₹${expense.amount.toLocaleString("en-IN")}? The amount will be treated as a confirmed office expense.`}
        confirmLabel="Approve Expense"
        cancelLabel="Cancel"
        tone="primary"
        onCancel={() => setConfirmApprove(false)}
        onConfirm={() => {
          setExpenseStatus(expense.id, "Approved");
          setConfirmApprove(false);
          onClose();
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete expense?"
        message={`Delete ${expense.id} (${expense.description})? This removes it from the office balance ledger and cannot be undone.`}
        confirmLabel="Delete Expense"
        cancelLabel="Keep Expense"
        tone="danger"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteExpense(expense.id);
          setConfirmDelete(false);
          onClose();
        }}
      />
    </>
  );
}
