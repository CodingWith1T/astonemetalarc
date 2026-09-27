"use client";

import { useMemo, useState } from "react";
import { Office, formatDate, formatINR, type OfficeExpense, type OfficeRequest } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import {
  AmountCell,
  Card,
  PageHead,
  StatCard,
  TotalsFooter,
} from "../../_components/table-kit";
import ExpenseDetailDrawer from "../../_components/ExpenseDetailDrawer";
import {
  ConfirmDialog,
  EmptyState,
  IconCheck,
  IconClipboard,
  IconClock,
  IconReceipt,
  IconScale,
  StatusBadge,
} from "../../_components/ui";

type QueueItem =
  | { kind: "expense"; data: OfficeExpense }
  | { kind: "request"; data: OfficeRequest };

const REJECT_REASONS = [
  "Amount exceeds approved office budget for this month",
  "Duplicate of an existing approved entry",
  "Required quotation or receipt not attached",
  "Not an office expense — belongs to a construction site",
];

export default function OfficeApprovalsClient() {
  const { expenses, requests, setRequestStatus, setExpenseStatus } = useOffice();
  const [tab, setTab] = useState<"all" | "expense" | "purchase" | "reimbursement" | "advance">("all");
  const [drawerExpense, setDrawerExpense] = useState<OfficeExpense | null>(null);
  const [decision, setDecision] = useState<{ item: QueueItem; action: "approve" | "reject"; reason: string } | null>(null);

  const queue = useMemo<QueueItem[]>(() => {
    const items: QueueItem[] = [];
    expenses
      .filter((e) => e.status === "Pending Approval")
      .forEach((e) => items.push({ kind: "expense", data: e }));
    requests
      .filter((r) => r.status === "Pending Approval")
      .forEach((r) => items.push({ kind: "request", data: r }));
    return items.sort((a, b) => {
      const ad = a.kind === "expense" ? a.data.date : a.data.date;
      const bd = b.kind === "expense" ? b.data.date : b.data.date;
      return ad.localeCompare(bd);
    });
  }, [expenses, requests]);

  const counts = useMemo(() => {
    const pendingExpenses = queue.filter((q) => q.kind === "expense");
    const byType = (t: string) => queue.filter((q) => q.kind === "request" && q.data.requestType === t);
    return {
      expense: pendingExpenses.length,
      purchase: byType("Purchase").length,
      reimbursement: byType("Reimbursement").length,
      advance: byType("Advance").length,
      maintenance: byType("Maintenance").length,
      other: byType("Other").length,
      travel: byType("Travel").length,
    };
  }, [queue]);

  const filtered = useMemo<QueueItem[]>(() => {
    if (tab === "all") return queue;
    if (tab === "expense") return queue.filter((q) => q.kind === "expense");
    const type = tab === "purchase" ? "Purchase" : tab === "reimbursement" ? "Reimbursement" : "Advance";
    return queue.filter((q) => q.kind === "request" && q.data.requestType === type);
  }, [queue, tab]);

  const totalValue = filtered.reduce(
    (s, q) => s + (q.kind === "expense" ? q.data.amount : q.data.estimatedAmount),
    0
  );

  const amountOf = (q: QueueItem) => (q.kind === "expense" ? q.data.amount : q.data.estimatedAmount);
  const titleOf = (q: QueueItem) => (q.kind === "expense" ? q.data.description : q.data.item);
  const refOf = (q: QueueItem) => q.data.id;
  const deptOf = (q: QueueItem) => q.data.department;
  const byOf = (q: QueueItem) => (q.kind === "expense" ? q.data.paidBy : q.data.requestedBy);

  const confirmDecision = () => {
    if (!decision) return;
    const { item, action } = decision;
    if (item.kind === "expense") {
      setExpenseStatus(item.data.id, action === "approve" ? "Approved" : "Rejected");
    } else {
      setRequestStatus(item.data.id, action === "approve" ? "Approved" : "Rejected");
    }
    setDecision(null);
  };

  const TABS = [
    { id: "all" as const, label: `All (${queue.length})` },
    { id: "expense" as const, label: `Expenses (${counts.expense})` },
    { id: "purchase" as const, label: `Purchase (${counts.purchase})` },
    { id: "reimbursement" as const, label: `Reimbursements (${counts.reimbursement})` },
    { id: "advance" as const, label: `Advances (${counts.advance})` },
  ];

  return (
    <div className="of-page">
      <PageHead
        title="Office Approvals"
        subtitle={`${Office.shortName} · Pending decisions on office expenses and requests`}
      />

      <div className="of-stats of-stats-4">
        <StatCard label="Pending Expenses" value={String(counts.expense)} icon={<IconReceipt size={18} />} trend="Awaiting approval" trendTone="down" />
        <StatCard label="Purchase Requests" value={String(counts.purchase)} icon={<IconClipboard size={18} />} trend="Awaiting approval" trendTone="down" />
        <StatCard label="Reimbursements" value={String(counts.reimbursement)} icon={<IconScale size={18} />} trend="Awaiting approval" trendTone="down" />
        <StatCard label="Advance Requests" value={String(counts.advance)} icon={<IconClock size={18} />} trend="Awaiting approval" trendTone="down" />
      </div>

      <div className="of-tabs of-tabs-card">
        {TABS.map((t) => (
          <button key={t.id} className={`of-tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="of-table-wrap">
        <div className="of-table-scroll">
          <table className="of-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Description</th>
                <th>Requested By</th>
                <th>Department</th>
                <th className="of-th-right">Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th className="of-th-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="Nothing pending here"
                      message="All items in this queue have been actioned. New submissions will appear automatically."
                      icon={<IconCheck size={26} />}
                    />
                  </td>
                </tr>
              )}
              {filtered.map((q) => (
                <tr key={refOf(q)}>
                  <td>
                    <span className="of-cell-title of-mono">{refOf(q)}</span>
                    <span className="of-cell-sub">{q.kind === "expense" ? "Office Expense" : `${q.data.requestType} Request`}</span>
                  </td>
                  <td>{titleOf(q)}</td>
                  <td>{byOf(q)}</td>
                  <td>{deptOf(q)}</td>
                  <td className="of-td-right"><AmountCell amount={amountOf(q)} /></td>
                  <td className="of-strong">{formatDate(q.data.date)}</td>
                  <td><StatusBadge status="Pending Approval" /></td>
                  <td className="of-td-center">
                    <div className="of-row-actions">
                      <button
                        className="of-row-btn"
                        onClick={() => (q.kind === "expense" ? setDrawerExpense(q.data) : null)}
                      >
                        View
                      </button>
                      <button
                        className="of-row-btn approve"
                        onClick={() => setDecision({ item: q, action: "approve", reason: "" })}
                      >
                        Approve
                      </button>
                      <button
                        className="of-row-btn reject"
                        onClick={() => setDecision({ item: q, action: "reject", reason: REJECT_REASONS[0] })}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TotalsFooter label={`Pending value — ${filtered.length} items`} amount={totalValue} />
      </div>

      <Card title="Approval Rules" subtitle="How decisions affect the office balance">
        <div className="of-note">
          Approving an expense reduces the office closing balance immediately and marks the entry as settled.
          Rejecting keeps the amount out of the balance and stores the reason against the record for audit.
        </div>
      </Card>

      <ExpenseDetailDrawer expense={drawerExpense} onClose={() => setDrawerExpense(null)} />

      <ConfirmDialog
        open={!!decision}
        title={decision?.action === "approve" ? "Approve this item?" : "Reject this item?"}
        message={
          decision
            ? decision.action === "approve"
              ? `Approve ${refOf(decision.item)} — ${titleOf(decision.item)} for ${formatINR(amountOf(decision.item))}? The office balance updates immediately.`
              : `Reject ${refOf(decision.item)} — ${titleOf(decision.item)} for ${formatINR(amountOf(decision.item))}? The amount will not be counted in the office balance.`
            : ""
        }
        confirmLabel={decision?.action === "approve" ? "Approve" : "Reject"}
        cancelLabel="Cancel"
        tone={decision?.action === "approve" ? "primary" : "danger"}
        onCancel={() => setDecision(null)}
        onConfirm={confirmDecision}
      />
    </div>
  );
}
