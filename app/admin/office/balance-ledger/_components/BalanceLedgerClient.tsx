"use client";

import { useState } from "react";
import { downloadCSV } from "../../_lib/csv";
import { Office, formatDate, formatINR, type OfficeExpense } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { Card, FiltersBar, PageHead, SortHeader, StatCard, useTableControls, type FilterDef } from "../../_components/table-kit";
import ExpenseDetailDrawer from "../../_components/ExpenseDetailDrawer";
import { EmptyState, IconArrowDown, IconArrowUp, IconDownload, IconReceipt, IconScale, IconWallet, StatusBadge } from "../../_components/ui";

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
    <div className="of-page">
      <PageHead
        title="Office Balance Ledger"
        subtitle={`${Office.shortName} · Every financial movement with a running balance`}
        actions={
          <button className="of-btn of-btn-ghost" onClick={handleExport}>
            <IconDownload /> Export Ledger
          </button>
        }
      />

      <div className="of-stats of-stats-4">
        <StatCard label="Opening Balance" value={formatINR(openingBalance)} icon={<IconScale size={18} />} sub="Carried forward" />
        <StatCard label="Total Money In" value={formatINR(totalFundsReceived)} icon={<IconArrowUp size={18} />} trend="Funds received" trendTone="up" />
        <StatCard label="Total Money Out" value={formatINR(totalExpenses)} icon={<IconArrowDown size={18} />} trend="Office expenses" trendTone="down" />
        <StatCard label="Closing Balance" value={formatINR(closingBalance)} icon={<IconWallet size={18} />} sub="Final running balance" />
      </div>

      <Card
        title="Ledger Rule"
        subtitle="The balance column updates after every single transaction"
        className="of-card-flow"
      >
        <div className="of-formula-bar">
          <span className="of-formula-part">{formatINR(openingBalance)}</span>
          <span className="of-formula-op">+</span>
          <span className="of-formula-part">{formatINR(totalFundsReceived)}</span>
          <span className="of-formula-op">−</span>
          <span className="of-formula-part">{formatINR(totalExpenses)}</span>
          <span className="of-formula-op">=</span>
          <span className="of-formula-part is-result">{formatINR(closingBalance)}</span>
        </div>
      </Card>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="of-table-wrap">
        <div className="of-ledger-scroll">
          <table className="of-table of-ledger-table">
            <thead>
              <tr>
                <SortHeader label="Date" sortKey="date" controls={controls} />
                <SortHeader label="Transaction" sortKey="transaction" controls={controls} />
                <th>Description</th>
                <th className="of-th-right">Money In</th>
                <th className="of-th-right">Money Out</th>
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
                    className={`of-row-click${l.transaction === "Opening" ? " is-opening" : ""}${l.transaction === "Funding" ? " is-funding" : ""}`}
                    onClick={() => expense && setDrawer(expense)}
                  >
                    <td className="of-strong">{formatDate(l.date)}</td>
                    <td>
                      <span className={`of-type of-type-${l.transaction.toLowerCase()}`}>{l.transaction}</span>
                    </td>
                    <td>
                      <span className="of-cell-title">{l.description}</span>
                      {expense && <span className="of-cell-sub"><StatusBadge status={expense.status} /></span>}
                    </td>
                    <td className="of-td-right">
                      {l.moneyIn ? <span className="of-amount in">+{formatINR(l.moneyIn)}</span> : <span className="of-muted">₹0</span>}
                    </td>
                    <td className="of-td-right">
                      {l.moneyOut ? <span className="of-amount out">−{formatINR(l.moneyOut)}</span> : <span className="of-muted">₹0</span>}
                    </td>
                    <td className="of-td-right"><span className="of-amount balance">{formatINR(l.balance)}</span></td>
                    <td className="of-mono">{l.reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Card title="Scope Note" subtitle="What this ledger covers">
        <div className="of-note">
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
