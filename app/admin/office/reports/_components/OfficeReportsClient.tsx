"use client";

import { useMemo, useState, type ReactElement } from "react";
import { downloadCSV } from "@/app/admin/_lib/finance/csv";
import {
  DEPARTMENTS,
  MONTHLY_SPEND,
  Office,
  REPORTS,
  formatDate,
  formatINR,
} from "../../_lib/office-data";
import { outstandingOf, useOffice } from "../../_lib/OfficeContext";
import { AmountCell, Card, FiltersBar, PageHead, useTableControls, type FilterDef } from "@/app/admin/_lib/finance/table-kit";
import { MonthlyTrendChart } from "@/app/admin/_lib/finance/charts";
import {
  IconBox,
  IconBuilding,
  IconCalendar,
  IconChart,
  IconDownload,
  IconPrint,
  IconReceipt,
  IconShield,
  IconTeam,
  IconWallet,
  StatusBadge,
} from "@/app/admin/_lib/finance/ui";

const ICONS: Record<string, ReactElement> = {
  receipt: <IconReceipt size={17} />,
  bank: <IconWallet size={17} />,
  wallet: <IconWallet size={17} />,
  team: <IconTeam size={17} />,
  building: <IconBuilding size={17} />,
  box: <IconBox size={17} />,
  calendar: <IconCalendar size={17} />,
};

const FILTERS: FilterDef[] = [
  { key: "category", label: "Category", options: ["Office Administration", "Employee", "Transportation", "Technology", "Professional", "Other"], allLabel: "All Categories" },
  { key: "department", label: "Department", options: [...DEPARTMENTS], allLabel: "All Departments" },
  { key: "paymentMethod", label: "Payment Method", options: ["Bank Transfer", "Cash", "Cheque", "UPI", "Card"] },
];

export default function OfficeReportsClient() {
  const {
    expenses,
    funds,
    pettyCashBalance,
    pendingPayables,
    totalFundsReceived,
    totalExpenses,
    closingBalance,
    openingBalance,
    totalAvailableFunds,
    assets,
    vendors,
    toast,
  } = useOffice();
  const [active, setActive] = useState("expense");

  const controls = useTableControls<Record<string, unknown>>({
    rows: expenses as unknown as Record<string, unknown>[],
    pageSize: 8,
    searchFields: (r) => [String(r.id), String(r.description), String(r.subcategory), String(r.vendor)],
    filters: FILTERS,
    defaultSort: { key: "amount", dir: "desc" },
  });

  const expenseRows = useMemo(
    () => controls.sorted as unknown as ReturnType<typeof Array.prototype.slice> as never[] as typeof expenses,
    [controls.sorted]
  );

  const exportReport = (kind: string) => {
    const r = REPORTS.find((x) => x.id === kind);
    if (kind === "expense") {
      downloadCSV(
        "office-expense-report.csv",
        ["Expense ID", "Date", "Category", "Subcategory", "Description", "Department", "Amount (₹)", "Status"],
        controls.sorted.map((x) => {
          const e = x as unknown as (typeof expenses)[number];
          return [e.id, e.date, e.category, e.subcategory, e.description, e.department, String(e.amount), e.status];
        })
      );
    } else if (kind === "funds") {
      downloadCSV(
        "office-funds-report.csv",
        ["Reference", "Date", "Description", "Source", "Amount (₹)", "Payment Method"],
        funds.map((f) => [f.reference, f.date, f.description, f.source, String(f.amount), f.paymentMethod])
      );
    } else {
      downloadCSV(
        `office-${kind}-report.csv`,
        ["Reference", "Description", "Department", "Amount (₹)", "Status"],
        controls.sorted.map((x) => {
          const e = x as unknown as (typeof expenses)[number];
          return [e.id, e.description, e.department, String(e.amount), e.status];
        })
      );
    }
    toast({ tone: "success", title: `${r?.name ?? "Report"} exported`, message: "CSV downloaded from the browser." });
  };

  const activeReport = REPORTS.find((r) => r.id === active)!;

  return (
    <div className="fin-page">
      <PageHead
        title="Office Reports"
        subtitle={`${Office.banner} · ${Office.month}`}
        actions={
          <>
            <button className="fin-btn fin-btn-ghost" onClick={() => toast({ tone: "info", title: "Export PDF", message: "PDF generation will be wired to the backend export service." })}>
              <IconDownload /> Export PDF
            </button>
            <button className="fin-btn fin-btn-ghost" onClick={() => exportReport(active)}>
              <IconDownload /> Export Excel
            </button>
            <button className="fin-btn fin-btn-ghost" onClick={() => typeof window !== "undefined" && window.print()}>
              <IconPrint /> Print
            </button>
          </>
        }
      />

      <Card title={Office.shortName} subtitle="Office financial summary for the selected period">
        <div className="fin-report-summary">
          <div>
            <span>Funds Received</span>
            <strong className="pos">{formatINR(totalFundsReceived)}</strong>
          </div>
          <div>
            <span>Total Expenses</span>
            <strong className="neg">−{formatINR(totalExpenses)}</strong>
          </div>
          <div>
            <span>Closing Balance</span>
            <strong className="acc">{formatINR(closingBalance)}</strong>
          </div>
          <div>
            <span>Petty Cash</span>
            <strong>{formatINR(pettyCashBalance)}</strong>
          </div>
          <div>
            <span>Pending Payables</span>
            <strong className="neg">{formatINR(pendingPayables)}</strong>
          </div>
        </div>
        <div className="fin-note">
          Opening balance {formatINR(openingBalance)} + funds received {formatINR(totalFundsReceived)} = available funds{" "}
          {formatINR(totalAvailableFunds)} − office expenses {formatINR(totalExpenses)} = closing balance{" "}
          {formatINR(closingBalance)}.
        </div>
      </Card>

      <Card title="Available Reports" subtitle="Select a report to preview, then export or print">
        <div className="fin-report-grid">
          {REPORTS.map((r) => (
            <button
              key={r.id}
              className={`fin-report-card${active === r.id ? " active" : ""}`}
              onClick={() => setActive(r.id)}
              style={active === r.id ? { borderColor: "var(--fin-accent)", background: "#fffaf5" } : undefined}
            >
              <span className="fin-report-icon">{ICONS[r.icon]}</span>
              <span>
                <strong>{r.name}</strong>
                <p>{r.description}</p>
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card title={activeReport.name} subtitle={activeReport.description}>
        <div className="fin-table-scroll">
          <table className="fin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Date</th>
                <th>Description</th>
                <th>Department</th>
                <th className="fin-th-right">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenseRows.length === 0 && (
                <tr>
                  <td colSpan={6}>No data for the current filters.</td>
                </tr>
              )}
              {expenseRows.slice(0, 12).map((e) => (
                <tr key={e.id}>
                  <td className="fin-mono">{e.id}</td>
                  <td className="fin-strong">{formatDate(e.date)}</td>
                  <td>{e.description}</td>
                  <td>{e.department}</td>
                  <td className="fin-td-right"><AmountCell amount={e.amount} /></td>
                  <td><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="fin-report-table-note">
          Showing up to 12 preview rows of {controls.total} matched entries. Use Export Excel for the full dataset.
        </div>
      </Card>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="fin-grid-2">
        <Card title="Monthly Financial Trend" subtitle="Funds vs expenses vs balance">
          <MonthlyTrendChart data={MONTHLY_SPEND} height={260} />
        </Card>
        <Card title="Vendor Payables" subtitle="Outstanding against office vendors">
          <div className="fin-profile-list">
            {vendors.map((v) => (
              <div key={v.id} className="fin-vendor-tx-row">
                <div>
                  <strong>{v.name}</strong>
                  <span>{v.category}</span>
                </div>
                <span className={outstandingOf(v) > 0 ? "fin-amount out" : "fin-amount"}>
                  {formatINR(outstandingOf(v))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="fin-grid-2">
        <Card title="Asset Register Summary" subtitle="Office assets by status">
          <div className="fin-profile-list">
            {Object.entries(
              assets.reduce<Record<string, number>>((acc, a) => {
                acc[a.status] = (acc[a.status] ?? 0) + 1;
                return acc;
              }, {})
            ).map(([status, count]) => (
              <div key={status} className="fin-vendor-tx-row">
                <div>
                  <strong>{status}</strong>
                  <span>{count} asset{count === 1 ? "" : "s"}</span>
                </div>
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Report Scope" subtitle="What these reports include">
          <div className="fin-note">
            <IconShield size={15} /> All reports above are scoped to <strong>Office Finance — Ghaziabad</strong>.
            Construction site costs (labour, materials, petrol, grocery, scaffolding, welding, cement, procurement)
            are excluded and reported separately.
          </div>
          <div className="fin-note">
            <IconChart size={15} /> Exports are generated in the browser for this prototype. Server-side PDF/Excel
            generation, scheduled reports and email delivery are part of the backend phase.
          </div>
        </Card>
      </div>
    </div>
  );
}
