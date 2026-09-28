"use client";

import { useState } from "react";
import { downloadCSV } from "@/app/admin/_lib/finance/csv";
import { Office, formatDate, formatINR, type OfficeExpense } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { Card, FiltersBar, PageHead, SortHeader, StatCard, useTableControls, type FilterDef } from "@/app/admin/_lib/finance/table-kit";
import ExpenseDetailDrawer from "../../_components/ExpenseDetailDrawer";
import { EmptyState, IconArrowDown, IconArrowUp, IconDownload, IconReceipt, IconScale, IconWallet, StatusBadge } from "@/app/admin/_lib/finance/ui";

const FILTERS: FilterDef[] = [
  { key: "transaction", label: "Transaction", options: ["Opening", "Funding", "Expense"] },
];

export default function BalanceLedgerClient() {
  const { ledger, expenses, openingBalance, totalFundsReceived, totalExpenses, closingBalance, toast } = useOffice();
  const [drawer, setDrawer] = useState<OfficeExpense | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: ledger as unknown as Record<string, unknown>[],
    pageSize: 15,
    searchFields: (r) => [String(r.description), String(r.reference), String(r.transaction)],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "asc" },
  });

  const handleExport = () => {
    downloadCSV(
      "ghaziabad-office-balance-ledger.csv",
      ["Date", "Transaction", "Description", "Money In (₹)", "Money Out (₹)", "Balance (₹)", "Reference"],
      controls.sorted.map((r) => {
        const l = r as unknown as (typeof ledger)[number];
        return [l.date, l.transaction, l.description, String(l.moneyIn), String(l.moneyOut), String(l.balance), l.reference];
      })
    );
    toast({ tone: "success", title: "Ledger exported", message: `${controls.sorted.length} ledger rows exported.` });
  };

  return (
    <div className="fin-page">
      <PageHead
        title="Office Balance Ledger"
        subtitle={`${Office.shortName} · Every financial movement with a running balance`}
        actions={
          <button className="fin-btn fin-btn-ghost" onClick={handleExport}>
            <IconDownload /> Export Ledger
          </button>
        }
      />

      <div className="fin-stats fin-stats-4">
        <StatCard label="Opening Balance" value={formatINR(openingBalance)} icon={<IconScale size={18} />} sub="Carried forward" />
        <StatCard label="Total Money In" value={formatINR(totalFundsReceived)} icon={<IconArrowUp size={18} />} trend="Funds received" trendTone="up" />
        <StatCard label="Total Money Out" value={formatINR(totalExpenses)} icon={<IconArrowDown size={18} />} trend="Office expenses" trendTone="down" />
        <StatCard label="Closing Balance" value={formatINR(closingBalance)} icon={<IconWallet size={18} />} sub="Final running balance" />
      </div>

      <Card
        title="Ledger Rule"
        subtitle="The balance column updates after every single transaction"
        className="fin-card-flow"
      >
        <div className="fin-formula-bar">
          <span className="fin-formula-part">{formatINR(openingBalance)}</span>
          <span className="fin-formula-op">+</span>
          <span className="fin-formula-part">{formatINR(totalFundsReceived)}</span>
          <span className="fin-formula-op">−</span>
          <span className="fin-formula-part">{formatINR(totalExpenses)}</span>
          <span className="fin-formula-op">=</span>
          <span className="fin-formula-part is-result">{formatINR(closingBalance)}</span>
        </div>
      </Card>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="fin-table-wrap">
        <div className="fin-ledger-scroll">
          <table className="fin-table fin-ledger-table">
            <thead>
              <tr>
                <SortHeader label="Date" sortKey="date" controls={controls} />
                <SortHeader label="Transaction" sortKey="transaction" controls={controls} />
                <th>Description</th>
                <th className="fin-th-right">Money In</th>
                <th className="fin-th-right">Money Out</th>
                <SortHeader label="Balance" sortKey="balance" controls={controls} align="right" />
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState title="No ledger entries" message="No transactions match the current filters." icon={<IconReceipt size={26} />} />
                  </td>
                </tr>
              )}
              {controls.pageRows.map((r) => {
                const l = r as unknown as (typeof ledger)[number];
                const expense = expenses.find((e) => e.id === l.sourceId);
                return (
                  <tr
                    key={l.id}
                    className={`fin-row-click${l.transaction === "Opening" ? " is-opening" : ""}${l.transaction === "Funding" ? " is-funding" : ""}`}
                    onClick={() => expense && setDrawer(expense)}
                  >
                    <td className="fin-strong">{formatDate(l.date)}</td>
                    <td>
                      <span className={`fin-type fin-type-${l.transaction.toLowerCase()}`}>{l.transaction}</span>
                    </td>
                    <td>
                      <span className="fin-cell-title">{l.description}</span>
                      {expense && <span className="fin-cell-sub"><StatusBadge status={expense.status} /></span>}
                    </td>
                    <td className="fin-td-right">
                      {l.moneyIn ? <span className="fin-amount in">+{formatINR(l.moneyIn)}</span> : <span className="fin-muted">₹0</span>}
                    </td>
                    <td className="fin-td-right">
                      {l.moneyOut ? <span className="fin-amount out">−{formatINR(l.moneyOut)}</span> : <span className="fin-muted">₹0</span>}
                    </td>
                    <td className="fin-td-right"><span className="fin-amount balance">{formatINR(l.balance)}</span></td>
                    <td className="fin-mono">{l.reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Card title="Scope Note" subtitle="What this ledger covers">
        <div className="fin-note">
          This ledger contains <strong>office finance only</strong> — funding received, office expenses, rent,
          utilities, salaries, vendors and petty cash movements. Construction site transactions (labour, materials,
          petrol, grocery, scaffolding, welding, cement, procurement) are recorded under Construction and are never
          mixed into these balances.
        </div>
      </Card>

      <ExpenseDetailDrawer expense={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}
