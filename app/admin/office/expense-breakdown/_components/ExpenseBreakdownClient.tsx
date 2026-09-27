"use client";

import { useMemo, useState } from "react";
import {
  DEPARTMENTS,
  MONTHLY_SPEND,
  Office,
  formatINR,
  type OfficeExpense,
} from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { Card, FiltersBar, PageHead, SortHeader, StatCard, TotalsFooter, useTableControls, AmountCell, type FilterDef } from "../../_components/table-kit";
import { CategoryBarChart, DonutChart, MonthlyTrendChart } from "../../_components/charts";
import ExpenseDetailDrawer from "../../_components/ExpenseDetailDrawer";
import { EmptyState, IconChart, IconDownload, IconReceipt, StatusBadge } from "../../_components/ui";
import { downloadCSV } from "../../_lib/csv";

const FILTERS: FilterDef[] = [
  { key: "category", label: "Category", options: ["Office Administration", "Employee", "Transportation", "Technology", "Professional", "Other"], allLabel: "All Categories" },
  { key: "department", label: "Department", options: [...DEPARTMENTS], allLabel: "All Departments" },
];

export default function ExpenseBreakdownClient() {
  const { expenses, totalExpenses, toast } = useOffice();
  const [drill, setDrill] = useState<{ label: string; rows: OfficeExpense[] } | null>(null);
  const [drawer, setDrawer] = useState<OfficeExpense | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: expenses as unknown as Record<string, unknown>[],
    pageSize: 10,
    searchFields: (r) => [String(r.description), String(r.subcategory), String(r.id), String(r.department)],
    filters: FILTERS,
    defaultSort: { key: "amount", dir: "desc" },
  });

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const bySub = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.subcategory] = (map[e.subcategory] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const byDept = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.department] = (map[e.department] ?? 0) + e.amount;
    });
    return DEPARTMENTS.map((d) => ({ name: d, value: map[d] ?? 0 })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const openDrill = (label: string) => {
    const match = expenses.filter(
      (e) => e.category === label || e.subcategory === label || e.department === label
    );
    if (match.length) {
      setDrill({ label, rows: match });
      setDrawer(null);
    }
  };

  const handleExport = () => {
    downloadCSV(
      "ghaziabad-office-expense-breakdown.csv",
      ["Category", "Subcategory", "Department", "Count", "Amount (₹)"],
      bySub.map((c) => {
        const rows = expenses.filter((e) => e.subcategory === c.name);
        return [rows[0]?.category ?? "", c.name, rows[0]?.department ?? "", String(rows.length), String(c.value)];
      })
    );
    toast({ tone: "success", title: "Breakdown exported", message: `${bySub.length} categories exported to CSV.` });
  };

  return (
    <div className="of-page">
      <PageHead
        title="September 2026 Office Expense Breakdown"
        subtitle={`${Office.shortName} · ${Office.line}`}
        actions={
          <button className="of-btn of-btn-ghost" onClick={handleExport}>
            <IconDownload /> Export
          </button>
        }
      />

      <div className="of-stats of-stats-4">
        <StatCard label="Total Expenses" value={formatINR(totalExpenses)} icon={<IconReceipt size={18} />} sub="September 2026" />
        <StatCard label="Categories Used" value={String(byCategory.length)} icon={<IconChart size={18} />} sub={`${bySub.length} subcategories`} />
        <StatCard label="Largest Category" value={byCategory[0]?.name ?? "—"} icon={<IconChart size={18} />} sub={formatINR(byCategory[0]?.value ?? 0)} />
        <StatCard
          label="Top Department"
          value={byDept[0]?.name ?? "—"}
          icon={<IconChart size={18} />}
          sub={formatINR(byDept[0]?.value ?? 0)}
        />
      </div>

      <div className="of-grid-2">
        <Card title="Category Distribution" subtitle="Donut — share of total office spend">
          <DonutChart data={byCategory} height={300} />
        </Card>
        <Card title="Category Comparison" subtitle="Bar — absolute amount per category">
          <CategoryBarChart data={bySub} height={300} />
        </Card>
      </div>

      <Card title="Monthly Spending" subtitle="June → September 2026">
        <MonthlyTrendChart data={MONTHLY_SPEND} height={300} />
      </Card>

      <div className="of-grid-2">
        <Card title="By Category" subtitle="Click a row to drill into the underlying expenses">
          <div className="of-profile-list">
            {byCategory.map((c) => (
              <button key={c.name} className="of-vendor-tx-row of-clickable-row" onClick={() => openDrill(c.name)}>
                <div>
                  <strong>{c.name}</strong>
                  <span>
                    {expenses.filter((e) => e.category === c.name).length} entries ·{" "}
                    {Math.round((c.value / totalExpenses) * 100)}% of spend
                  </span>
                </div>
                <span className="of-amount">{formatINR(c.value)}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="By Department" subtitle="Click a row to drill into the underlying expenses">
          <div className="of-profile-list">
            {byDept.map((d) => (
              <button key={d.name} className="of-vendor-tx-row of-clickable-row" onClick={() => openDrill(d.name)}>
                <div>
                  <strong>{d.name}</strong>
                  <span>
                    {expenses.filter((e) => e.department === d.name).length} entries ·{" "}
                    {Math.round((d.value / totalExpenses) * 100)}% of spend
                  </span>
                </div>
                <span className="of-amount">{formatINR(d.value)}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {drill ? (
        <Card
          title={`${drill.label} — ${drill.rows.length} entries`}
          subtitle={`Total ${formatINR(drill.rows.reduce((s, r) => s + r.amount, 0))}`}
          action={
            <button className="of-link-btn" onClick={() => setDrill(null)}>
              Close drill-down
            </button>
          }
        >
          <div className="of-table-scroll">
            <table className="of-table">
              <thead>
                <tr>
                  <SortHeader label="Date" sortKey="date" controls={controls} />
                  <th>Expense ID</th>
                  <th>Description</th>
                  <th>Department</th>
                  <th className="of-th-right">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {drill.rows.map((e) => (
                  <tr key={e.id} className="of-row-click" onClick={() => setDrawer(e)}>
                    <td className="of-strong">{e.date}</td>
                    <td className="of-mono">{e.id}</td>
                    <td>{e.description}</td>
                    <td>{e.department}</td>
                    <td className="of-td-right"><AmountCell amount={e.amount} /></td>
                    <td><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <FiltersBar controls={controls} filters={FILTERS} />
      )}

      {!drill && (
        <div className="of-table-wrap">
          <div className="of-table-scroll">
            <table className="of-table">
              <thead>
                <tr>
                  <SortHeader label="Date" sortKey="date" controls={controls} />
                  <th>Expense ID</th>
                  <SortHeader label="Category" sortKey="category" controls={controls} />
                  <SortHeader label="Subcategory" sortKey="subcategory" controls={controls} />
                  <th>Description</th>
                  <SortHeader label="Department" sortKey="department" controls={controls} />
                  <SortHeader label="Amount" sortKey="amount" controls={controls} align="right" />
                  <SortHeader label="Status" sortKey="status" controls={controls} />
                </tr>
              </thead>
              <tbody>
                {controls.pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState title="No expenses found" message="No expenses match the current filters." />
                    </td>
                  </tr>
                )}
                {controls.pageRows.map((r) => {
                  const e = r as unknown as OfficeExpense;
                  return (
                    <tr key={e.id} className="of-row-click" onClick={() => setDrawer(e)}>
                      <td className="of-strong">{e.date}</td>
                      <td className="of-mono">{e.id}</td>
                      <td>{e.category}</td>
                      <td><span className="of-chip">{e.subcategory}</span></td>
                      <td>{e.description}</td>
                      <td>{e.department}</td>
                      <td className="of-td-right"><AmountCell amount={e.amount} /></td>
                      <td><StatusBadge status={e.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <TotalsFooter label={`Total — ${controls.total} entries`} amount={controls.sum} />
        </div>
      )}

      <ExpenseDetailDrawer expense={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}
