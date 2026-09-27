"use client";

import { useState } from "react";
import { Office, formatINR, type OfficeFund } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { useOfficeUI } from "../../_components/OfficeShell";
import { FiltersBar, PageHead, StatCard, useTableControls, AmountCell, type FilterDef } from "../../_components/table-kit";
import { EmptyState, IconCash, IconScale, IconWallet, StatusBadge } from "../../_components/ui";

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
    <div className="of-page">
      <PageHead
        title="Office Funds"
        subtitle={`${Office.shortName} · ${Office.line}`}
        actions={
          <button className="of-btn of-btn-primary" onClick={() => open("funds")}>
            + Add Funds
          </button>
        }
      />

      <div className="of-stats of-stats-3">
        <StatCard label="Total Funds Received" value={formatINR(totalFundsReceived)} icon={<IconWallet size={18} />} sub={`${credited.length} credited transfers`} />
        <StatCard label="Current Balance" value={formatINR(closingBalance)} icon={<IconScale size={18} />} sub="Available funds − office expenses" />
        <StatCard label="Opening Balance" value={formatINR(Office.openingBalance)} icon={<IconCash size={18} />} sub="Carried forward, not a fund receipt" />
      </div>

      <div className="of-note of-note-info">
        Opening balance is <strong>not</strong> counted as new funds received. New funds received ₹
        {totalFundsReceived.toLocaleString("en-IN")} + opening ₹{Office.openingBalance.toLocaleString("en-IN")} = available ₹
        {(totalFundsReceived + Office.openingBalance).toLocaleString("en-IN")}.
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="of-table-wrap">
        <div className="of-table-scroll">
          <table className="of-table">
            <thead>
              <tr>
                <th onClick={() => controls.toggleSort("date")}>Date</th>
                <th>Description</th>
                <th className="of-th-right" onClick={() => controls.toggleSort("amount")}>Amount</th>
                <th>Payment Method</th>
                <th>Reference</th>
                <th>Added By</th>
                <th>Status</th>
                <th className="of-th-center">Actions</th>
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
                  <tr key={f.id} onClick={() => setViewing(f)} className="of-row-click">
                    <td className="of-strong">{f.date === "2026-09-01" ? "01 Sep" : `${Number(f.date.slice(-2))} Sep`}</td>
                    <td>
                      <span className="of-cell-title">{f.description}</span>
                      <span className="of-cell-sub">{f.source}</span>
                    </td>
                    <td className="of-td-right"><AmountCell amount={f.amount} tone="in" /></td>
                    <td>{f.paymentMethod}</td>
                    <td className="of-mono">{f.reference}</td>
                    <td>{f.addedBy}</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td className="of-td-center">
                      <button
                        className="of-row-btn"
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
        <div className="of-totals">
          <span className="of-totals-label">Total</span>
          <span className="of-totals-amount">{formatINR(creditedTotal)}</span>
        </div>
      </div>

      {viewing && (
        <div className="of-overlay" onMouseDown={() => setViewing(null)}>
          <div className="of-modal" style={{ maxWidth: 560 }} onMouseDown={(e) => e.stopPropagation()}>
            <header className="of-modal-head">
              <div>
                <h3>{viewing.reference} — {viewing.description}</h3>
                <p className="of-modal-sub">{Office.banner}</p>
              </div>
              <button className="of-icon-btn" onClick={() => setViewing(null)}>×</button>
            </header>
            <div className="of-modal-body">
              <div className="of-detail-list">
                <div className="of-detail-row"><span className="of-detail-label">Date</span><span className="of-detail-value">{viewing.date}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Amount</span><span className="of-detail-value of-tone-positive">+{formatINR(viewing.amount)}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Funding Source</span><span className="of-detail-value">{viewing.source}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Payment Method</span><span className="of-detail-value">{viewing.paymentMethod}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Bank / Account</span><span className="of-detail-value">{viewing.bank}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Reference</span><span className="of-detail-value">{viewing.reference}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Added By</span><span className="of-detail-value">{viewing.addedBy}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Attachment</span><span className="of-detail-value">{viewing.attachment || "—"}</span></div>
                <div className="of-detail-row"><span className="of-detail-label">Notes</span><span className="of-detail-value">{viewing.notes || "—"}</span></div>
              </div>
            </div>
            <footer className="of-modal-foot">
              <button className="of-btn of-btn-ghost" onClick={() => toast({ tone: "info", title: "Audit history", message: "Full fund audit trail arrives with the backend." })}>
                View Audit History
              </button>
              <button className="of-btn of-btn-primary" onClick={() => setViewing(null)}>Close</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
