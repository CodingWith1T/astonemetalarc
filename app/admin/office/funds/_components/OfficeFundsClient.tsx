"use client";

import { useState } from "react";
import { Office, formatINR, type OfficeFund } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { useOfficeUI } from "../../_components/OfficeShell";
import { FiltersBar, PageHead, StatCard, useTableControls, AmountCell, type FilterDef } from "@/app/admin/_lib/finance/table-kit";
import { EmptyState, IconCash, IconScale, IconWallet, StatusBadge } from "@/app/admin/_lib/finance/ui";

const FILTERS: FilterDef[] = [
  { key: "paymentMethod", label: "Payment Method", options: ["Bank Transfer", "Cash", "Cheque", "UPI", "Card"] },
  { key: "source", label: "Source", options: ["Head Office", "Project Collection", "Owner Injection"], allLabel: "All Sources" },
  { key: "status", label: "Status", options: ["Credited"] },
];

export default function OfficeFundsClient() {
  const { funds, totalFundsReceived, closingBalance, toast } = useOffice();
  const { open } = useOfficeUI();
  const [viewing, setViewing] = useState<OfficeFund | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: funds as unknown as Record<string, unknown>[],
    pageSize: 10,
    searchFields: (r) => [String(r.reference), String(r.description), String(r.addedBy), String(r.source)],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "desc" },
  });

  const credited = controls.sorted.filter((r) => r.reference !== "OPENING");
  const creditedTotal = credited.reduce((s, r) => s + (r.amount as number), 0);

  return (
    <div className="fin-page">
      <PageHead
        title="Office Funds"
        subtitle={`${Office.shortName} · ${Office.line}`}
        actions={
          <button className="fin-btn fin-btn-primary" onClick={() => open("funds")}>
            + Add Funds
          </button>
        }
      />

      <div className="fin-stats fin-stats-3">
        <StatCard label="Total Funds Received" value={formatINR(totalFundsReceived)} icon={<IconWallet size={18} />} sub={`${credited.length} credited transfers`} />
        <StatCard label="Current Balance" value={formatINR(closingBalance)} icon={<IconScale size={18} />} sub="Available funds − office expenses" />
        <StatCard label="Opening Balance" value={formatINR(Office.openingBalance)} icon={<IconCash size={18} />} sub="Carried forward, not a fund receipt" />
      </div>

      <div className="fin-note fin-note-info">
        Opening balance is <strong>not</strong> counted as new funds received. New funds received ₹
        {totalFundsReceived.toLocaleString("en-IN")} + opening ₹{Office.openingBalance.toLocaleString("en-IN")} = available ₹
        {(totalFundsReceived + Office.openingBalance).toLocaleString("en-IN")}.
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="fin-table-wrap">
        <div className="fin-table-scroll">
          <table className="fin-table">
            <thead>
              <tr>
                <th onClick={() => controls.toggleSort("date")}>Date</th>
                <th>Description</th>
                <th className="fin-th-right" onClick={() => controls.toggleSort("amount")}>Amount</th>
                <th>Payment Method</th>
                <th>Reference</th>
                <th>Added By</th>
                <th>Status</th>
                <th className="fin-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState title="No funds found" message="Try clearing the filters or add a new funding entry." />
                  </td>
                </tr>
              )}
              {controls.pageRows.map((r) => {
                const f = r as unknown as OfficeFund;
                return (
                  <tr key={f.id} onClick={() => setViewing(f)} className="fin-row-click">
                    <td className="fin-strong">{f.date === "2026-09-01" ? "01 Sep" : `${Number(f.date.slice(-2))} Sep`}</td>
                    <td>
                      <span className="fin-cell-title">{f.description}</span>
                      <span className="fin-cell-sub">{f.source}</span>
                    </td>
                    <td className="fin-td-right"><AmountCell amount={f.amount} tone="in" /></td>
                    <td>{f.paymentMethod}</td>
                    <td className="fin-mono">{f.reference}</td>
                    <td>{f.addedBy}</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td className="fin-td-center">
                      <button
                        className="fin-row-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewing(f);
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
        <div className="fin-totals">
          <span className="fin-totals-label">Total</span>
          <span className="fin-totals-amount">{formatINR(creditedTotal)}</span>
        </div>
      </div>

      {viewing && (
        <div className="fin-overlay" onMouseDown={() => setViewing(null)}>
          <div className="fin-modal" style={{ maxWidth: 560 }} onMouseDown={(e) => e.stopPropagation()}>
            <header className="fin-modal-head">
              <div>
                <h3>{viewing.reference} — {viewing.description}</h3>
                <p className="fin-modal-sub">{Office.banner}</p>
              </div>
              <button className="fin-icon-btn" onClick={() => setViewing(null)}>×</button>
            </header>
            <div className="fin-modal-body">
              <div className="fin-detail-list">
                <div className="fin-detail-row"><span className="fin-detail-label">Date</span><span className="fin-detail-value">{viewing.date}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Amount</span><span className="fin-detail-value fin-tone-positive">+{formatINR(viewing.amount)}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Funding Source</span><span className="fin-detail-value">{viewing.source}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Payment Method</span><span className="fin-detail-value">{viewing.paymentMethod}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Bank / Account</span><span className="fin-detail-value">{viewing.bank}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Reference</span><span className="fin-detail-value">{viewing.reference}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Added By</span><span className="fin-detail-value">{viewing.addedBy}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Attachment</span><span className="fin-detail-value">{viewing.attachment || "—"}</span></div>
                <div className="fin-detail-row"><span className="fin-detail-label">Notes</span><span className="fin-detail-value">{viewing.notes || "—"}</span></div>
              </div>
            </div>
            <footer className="fin-modal-foot">
              <button className="fin-btn fin-btn-ghost" onClick={() => toast({ tone: "info", title: "Audit history", message: "Full fund audit trail arrives with the backend." })}>
                View Audit History
              </button>
              <button className="fin-btn fin-btn-primary" onClick={() => setViewing(null)}>Close</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
