"use client";

import { useState } from "react";
import { Office, formatDate, formatINR, type OfficeRequest } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { useOfficeUI } from "../../_components/OfficeShell";
import {
  AmountCell,
  Card,
  FiltersBar,
  PageHead,
  SortHeader,
  StatCard,
  TotalsFooter,
  useTableControls,
  type FilterDef,
} from "@/app/admin/_lib/finance/table-kit";
import {
  DetailRow,
  Drawer,
  EmptyState,
  IconCheck,
  IconClipboard,
  IconClock,
  IconFile,
  IconPlus,
  IconScale,
  StatusBadge,
} from "@/app/admin/_lib/finance/ui";

const FILTERS: FilterDef[] = [
  { key: "requestType", label: "Request Type", options: ["Purchase", "Reimbursement", "Advance", "Maintenance", "Travel", "Other"] },
  { key: "department", label: "Department", options: ["Administration", "HR", "Finance", "Management", "Sales", "IT", "Operations"], allLabel: "All Departments" },
  { key: "priority", label: "Priority", options: ["Low", "Normal", "High", "Urgent"] },
  { key: "status", label: "Status", options: ["Draft", "Submitted", "Pending Approval", "Approved", "Rejected", "Purchased", "Completed"], allLabel: "All Status" },
];

export default function OfficeRequestsClient() {
  const { requests, setRequestStatus, setConfirm } = useOffice();
  const { open } = useOfficeUI();
  const [viewing, setViewing] = useState<OfficeRequest | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: requests as unknown as Record<string, unknown>[],
    pageSize: 10,
    searchFields: (r) => [String(r.id), String(r.item), String(r.requestedBy), String(r.reason)],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "desc" },
  });

  const pending = requests.filter((r) => r.status === "Pending Approval");
  const approved = requests.filter((r) => r.status === "Approved" || r.status === "Purchased" || r.status === "Completed");

  return (
    <div className="fin-page">
      <PageHead
        title="Office Requests"
        subtitle={`${Office.shortName} · Purchase · Reimbursement · Advance · Maintenance · Travel`}
        actions={
          <button className="fin-btn fin-btn-primary" onClick={() => open("request")}>
            <IconPlus /> New Request
          </button>
        }
      />

      <div className="fin-stats fin-stats-4">
        <StatCard label="Total Requests" value={String(requests.length)} icon={<IconClipboard size={18} />} sub="All request types" />
        <StatCard label="Pending Approval" value={String(pending.length)} icon={<IconClock size={18} />} trend={`${formatINR(pending.reduce((s, r) => s + r.estimatedAmount, 0))} value`} trendTone="down" sub="Needs sign-off" />
        <StatCard label="Approved" value={String(approved.length)} icon={<IconCheck size={18} />} trend="Cleared for action" trendTone="up" />
        <StatCard label="Estimated Value" value={formatINR(requests.reduce((s, r) => s + r.estimatedAmount, 0))} icon={<IconScale size={18} />} sub="All requests" />
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="fin-table-wrap">
        <div className="fin-table-scroll">
          <table className="fin-table">
            <thead>
              <tr>
                <SortHeader label="Request" sortKey="id" controls={controls} />
                <SortHeader label="Type" sortKey="requestType" controls={controls} />
                <th>Item</th>
                <SortHeader label="Department" sortKey="department" controls={controls} />
                <SortHeader label="Requested By" sortKey="requestedBy" controls={controls} />
                <SortHeader label="Amount" sortKey="estimatedAmount" controls={controls} align="right" />
                <SortHeader label="Priority" sortKey="priority" controls={controls} />
                <SortHeader label="Status" sortKey="status" controls={controls} />
                <th className="fin-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      title="No requests found"
                      message="No office requests match the current filters."
                      action={
                        <button className="fin-btn fin-btn-primary" onClick={() => open("request")}>
                          <IconPlus /> New Request
                        </button>
                      }
                    />
                  </td>
                </tr>
              )}
              {controls.pageRows.map((r) => {
                const req = r as unknown as OfficeRequest;
                return (
                  <tr key={req.id} className="fin-row-click" onClick={() => setViewing(req)}>
                    <td className="fin-mono">{req.id}</td>
                    <td><span className="fin-chip">{req.requestType}</span></td>
                    <td>
                      <span className="fin-cell-title">{req.item}</span>
                      <span className="fin-cell-sub">Qty {req.quantity} · {req.reason}</span>
                    </td>
                    <td>{req.department}</td>
                    <td>{req.requestedBy}</td>
                    <td className="fin-td-right"><AmountCell amount={req.estimatedAmount} /></td>
                    <td><StatusBadge status={req.priority} /></td>
                    <td><StatusBadge status={req.status} /></td>
                    <td className="fin-td-center">
                      <button
                        className="fin-row-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewing(req);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TotalsFooter label={`Total — ${controls.total} requests`} amount={controls.sum} />
      </div>

      <Card title="Request Workflow" subtitle="Every office request follows the same approval path">
        <ol className="fin-flow-inline">
          <li>Draft</li>
          <li>Submitted</li>
          <li>Pending Approval</li>
          <li>Approved</li>
          <li>Purchased</li>
          <li>Completed</li>
        </ol>
        <div className="fin-note">
          Rejected requests keep their full history so the decision can be audited later. Approved requests can be
          converted into an office expense from the detail drawer.
        </div>
      </Card>

      {viewing && (
        <Drawer
          open
          title={`${viewing.id} — ${viewing.item}`}
          subtitle={`${viewing.requestType} · ${viewing.department}`}
          onClose={() => setViewing(null)}
          footer={
            <div className="fin-drawer-actions">
              {viewing.status === "Pending Approval" && (
                <>
                  <button
                    className="fin-btn fin-btn-danger-ghost"
                    onClick={() =>
                      setConfirm({
                        title: "Reject request?",
                        message: `Reject ${viewing.id} for ${formatINR(viewing.estimatedAmount)}? The requester will see it as Rejected.`,
                        confirmLabel: "Reject Request",
                        tone: "danger",
                        onConfirm: () => setRequestStatus(viewing.id, "Rejected"),
                      })
                    }
                  >
                    Reject
                  </button>
                  <button
                    className="fin-btn fin-btn-primary"
                    onClick={() =>
                      setConfirm({
                        title: "Approve request?",
                        message: `Approve ${viewing.id} for ${formatINR(viewing.estimatedAmount)}? It will move to Approved status.`,
                        confirmLabel: "Approve Request",
                        tone: "primary",
                        onConfirm: () => setRequestStatus(viewing.id, "Approved"),
                      })
                    }
                  >
                    Approve
                  </button>
                </>
              )}
              <button className="fin-btn fin-btn-ghost" onClick={() => setViewing(null)}>
                Close
              </button>
            </div>
          }
        >
          <div className="fin-drawer-hero">
            <div>
              <span className="fin-drawer-hero-label">Estimated Amount</span>
              <strong className="fin-drawer-hero-amount">{formatINR(viewing.estimatedAmount)}</strong>
            </div>
            <StatusBadge status={viewing.status} />
          </div>

          <div className="fin-detail-list">
            <DetailRow label="Requested By" value={viewing.requestedBy} />
            <DetailRow label="Department" value={viewing.department} />
            <DetailRow label="Request Type" value={viewing.requestType} />
            <DetailRow label="Item" value={viewing.item} />
            <DetailRow label="Quantity" value={String(viewing.quantity)} />
            <DetailRow label="Estimated Amount" value={formatINR(viewing.estimatedAmount)} />
            <DetailRow label="Reason" value={viewing.reason || "—"} />
            <DetailRow label="Priority" value={<StatusBadge status={viewing.priority} />} />
            <DetailRow label="Date" value={formatDate(viewing.date)} />
            <DetailRow
              label="Attachment"
              value={
                viewing.attachment ? (
                  <span className="fin-file-chip">
                    <IconFile size={13} /> {viewing.attachment}
                  </span>
                ) : (
                  "Not uploaded"
                )
              }
            />
          </div>

          <div className="fin-section-title">
            <h3>Approval History</h3>
          </div>
          <div className="fin-timeline">
            <div className="fin-timeline-item">
              <span className="fin-timeline-dot fin-timeline-created" />
              <div className="fin-timeline-body">
                <div className="fin-timeline-head">
                  <strong>Created</strong>
                  <span>{formatDate(viewing.date)} · 10:15 AM</span>
                </div>
                <p>Request raised by {viewing.requestedBy}</p>
              </div>
            </div>
            <div className="fin-timeline-item">
              <span className="fin-timeline-dot fin-timeline-moved" />
              <div className="fin-timeline-body">
                <div className="fin-timeline-head">
                  <strong>Submitted</strong>
                  <span>{formatDate(viewing.date)} · 10:25 AM</span>
                </div>
                <p>Sent for office manager approval</p>
              </div>
            </div>
            {viewing.status !== "Draft" && viewing.status !== "Submitted" && (
              <div className="fin-timeline-item">
                <span className={`fin-timeline-dot fin-timeline-${viewing.status === "Rejected" ? "rejected" : "approved"}`} />
                <div className="fin-timeline-body">
                  <div className="fin-timeline-head">
                    <strong>{viewing.status}</strong>
                    <span>{formatDate(viewing.date)} · 12:40 PM</span>
                  </div>
                  <p>Decision recorded by Admin</p>
                </div>
              </div>
            )}
          </div>

          <div className="fin-note">
            Requests are office-level only. Site procurement requests stay under Construction → Sites and never
            affect the Ghaziabad office balance.
          </div>
        </Drawer>
      )}
    </div>
  );
}
