"use client";

import { useMemo, useState } from "react";
import { DEPARTMENTS, Office, formatINR, type OfficeExpense } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { AmountCell, Card, PageHead, StatCard, useTableControls } from "../../_components/table-kit";
import { DepartmentBarChart } from "../../_components/charts";
import ExpenseDetailDrawer from "../../_components/ExpenseDetailDrawer";
import { EmptyState, StatusBadge } from "../../_components/ui";

export default function DepartmentsClient() {
  const { expenses, totalExpenses } = useOffice();
  const [selected, setSelected] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<OfficeExpense | null>(null);

  const rows = useMemo(() => {
    const map: Record<string, { total: number; count: number; approved: number; pending: number }> = {};
    DEPARTMENTS.forEach((d) => (map[d] = { total: 0, count: 0, approved: 0, pending: 0 }));
    expenses.forEach((e) => {
      const b = map[e.department];
      b.total += e.amount;
      b.count += 1;
      if (e.status === "Pending Approval") b.pending += e.amount;
      else b.approved += e.amount;
    });
    return DEPARTMENTS.map((d) => ({ name: d, value: map[d].total, ...map[d] }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const filtered = useMemo(
    () => (selected ? expenses.filter((e) => e.department === selected) : expenses),
    [expenses, selected]
  );

  const controls = useTableControls<Record<string, unknown>>({
    rows: filtered as unknown as Record<string, unknown>[],
    pageSize: 10,
    searchFields: (r) => [String(r.id), String(r.description), String(r.subcategory), String(r.paidBy)],
    filters: [],
    defaultSort: { key: "date", dir: "desc" },
  });

  const top = rows[0];

  return (
    <div className="of-page">
      <PageHead
        title="Department Expenses"
        subtitle={`${Office.shortName} · ${Office.line} · ${Office.month}`}
      />

      <div className="of-stats of-stats-4">
        <StatCard label="Departments" value={String(DEPARTMENTS.length)} sub="Office cost centres" />
        <StatCard label="Total Spend" value={formatINR(totalExpenses)} sub="All departments" />
        <StatCard label="Top Department" value={top?.name ?? "—"} sub={formatINR(top?.value ?? 0)} />
        <StatCard
          label="Top Share"
          value={`${Math.round(((top?.value ?? 0) / totalExpenses) * 100)}%`}
          sub="Of total office spend"
        />
      </div>

      <div className="of-split">
        <Card title="Department Comparison" subtitle="Click a department to filter the expense list below">
          <DepartmentBarChart data={rows} height={340} />
          <div className="of-dept-pills">
            {rows.map((d) => (
              <button
                key={d.name}
                className={`of-dept-pill${selected === d.name ? " active" : ""}`}
                onClick={() => setSelected(selected === d.name ? null : d.name)}
              >
                {d.name}
                <strong>{formatINR(d.value)}</strong>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Department Summary" subtitle={selected ? `Filtered by ${selected}` : "All departments"}>
          <div className="of-profile-list">
            {rows.map((d) => (
              <div key={d.name} className="of-vendor-tx-row">
                <div>
                  <strong>{d.name}</strong>
                  <span>
                    {d.count} entries · {formatINR(d.approved)} approved
                    {d.pending > 0 ? ` · ${formatINR(d.pending)} pending` : ""}
                  </span>
                </div>
                <span className="of-amount">{formatINR(d.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="of-table-wrap">
        <div className="of-table-scroll">
          <table className="of-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Paid By</th>
                <th className="of-th-right">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState title="No expenses" message="No expenses for the selected department." />
                  </td>
                </tr>
              )}
              {controls.pageRows.map((r) => {
                const e = r as unknown as OfficeExpense;
                return (
                  <tr key={e.id} className="of-row-click" onClick={() => setDrawer(e)}>
                    <td className="of-strong">{e.date}</td>
                    <td className="of-mono">{e.id}</td>
                    <td><span className="of-chip">{e.subcategory}</span></td>
                    <td>{e.description}</td>
                    <td>{e.paidBy}</td>
                    <td className="of-td-right"><AmountCell amount={e.amount} /></td>
                    <td><StatusBadge status={e.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseDetailDrawer expense={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}
