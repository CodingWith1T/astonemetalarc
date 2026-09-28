"use client";

import { useState } from "react";
import { Card, ExportButton, PageHead, StatCard } from "@/app/admin/_lib/finance/table-kit";
import {
  IconBox,
  IconBuilding,
  IconChart,
  IconClipboard,
  IconClock,
  IconTeam,
} from "@/app/admin/_lib/finance/ui";
import {
  CategoryBarChart,
  DepartmentBarChart,
  DonutChart,
  MonthlyTrendChart,
} from "@/app/admin/_lib/finance/charts";
import { downloadCSV } from "@/app/admin/_lib/finance/csv";
import { formatDate, formatINR, formatMoney, formatPercent } from "@/app/admin/_lib/finance/format";
import { COST_GROUPS, monthLabel, totalsByMonth } from "@/app/admin/_lib/finance/sites-data";
import { useSiteFinance } from "../../_lib/SiteFinanceContext";
import { useSiteFinanceUI } from "../../_components/SiteFinanceShell";

const GROUP_COLOUR: Record<string, string> = {
  Labour: "#2563eb",
  Material: "#ea580c",
  Subcontractor: "#7c3aed",
  Machinery: "#059669",
  "Equipment Hire": "#0d9488",
  "Site Overheads": "#64748b",
  "Professional Fees": "#d97706",
};

export default function SiteReportsClient() {
  const {
    site,
    projects,
    expenses,
    remittances,
    periodExpenses,
    totals,
    groupTotals,
    projectTotals,
    period,
    pushToast,
  } =
    useSiteFinance();
  const { open } = useSiteFinanceUI();

  const [view, setView] = useState<"period" | "all">("period");

  const cur = site.currency;
  const money = (n: number) => formatMoney(n, cur);
  const rows = view === "period" ? periodExpenses : expenses;
  const scopeLabel = view === "period" ? period.label : "All time";

  /* Cumulative ledger snapshot per month, for the trend line. */
  const trendData = (() => {
    const expensesByMonth = new Map(totalsByMonth(expenses).map((m) => [m.month, m.amount]));
    const fundsByMonth = new Map<string, number>();
    for (const r of remittances) {
      const key = r.date.slice(0, 7);
      fundsByMonth.set(key, (fundsByMonth.get(key) ?? 0) + r.amount);
    }
    const months = [...new Set([...expensesByMonth.keys(), ...fundsByMonth.keys()])].sort();
    return months.reduce<{ month: string; funds: number; expenses: number; balance: number }[]>(
      (acc, key) => {
        const funds = fundsByMonth.get(key) ?? 0;
        const spend = expensesByMonth.get(key) ?? 0;
        const previous = acc.length ? acc[acc.length - 1].balance : site.openingBalance;
        acc.push({ month: monthLabel(key), funds, expenses: spend, balance: previous + funds - spend });
        return acc;
      },
      []
    );
  })();

  const periodSpend = periodExpenses.reduce((s, e) => s + e.amount, 0);
  const allSpend = expenses.reduce((s, e) => s + e.amount, 0);

  const contractorSpend = rows
    .filter((e) => e.group === "Subcontractor")
    .reduce((s, e) => s + e.amount, 0);
  const machinerySpend = rows
    .filter((e) => e.group === "Machinery" || e.group === "Equipment Hire")
    .reduce((s, e) => s + e.amount, 0);

  const topHeads = (() => {
    const m = new Map<string, number>();
    for (const e of rows) {
      const k = `${e.group} · ${e.head}`;
      m.set(k, (m.get(k) ?? 0) + e.amount);
    }
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  })();

  const payeeData = (() => {
    const m = new Map<string, number>();
    for (const e of rows) m.set(e.paidTo, (m.get(e.paidTo) ?? 0) + e.amount);
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  })();

  const donutData = groupTotals.map((g) => ({
    name: g.group,
    value: g.amount,
    fill: GROUP_COLOUR[g.group] ?? "#64748b",
  }));
  const barData = groupTotals.map((g) => ({ name: g.group, amount: g.amount, fill: GROUP_COLOUR[g.group] }));

  const totalProjectSpend = projectTotals.reduce((s, p) => s + p.spent, 0);
  const totalProjectBudget = projectTotals.reduce((s, p) => s + p.budget, 0);

  const exportSummary = () => {
    downloadCSV(
      `site-cost-report-${site.name.toLowerCase()}-${view}.csv`,
      ["Cost Group", "Entries", "Amount", "Share %"],
      groupTotals.map((g) => [g.group, String(g.count), String(g.amount), String(g.share)])
    );
    pushToast("Report exported", `Cost summary for ${scopeLabel} downloaded as CSV.`, "info");
  };

  return (
    <>
      <PageHead
        title="Site Cost Reports"
        subtitle={`Consolidated construction cost analysis for ${site.name} · ${site.projectCode}`}
        actions={
          <>
            <div className="fin-segmented" role="group" aria-label="Reporting scope">
              <button
                className={view === "period" ? "active" : ""}
                onClick={() => setView("period")}
              >
                {period.label}
              </button>
              <button className={view === "all" ? "active" : ""} onClick={() => setView("all")}>
                All time
              </button>
            </div>
            <ExportButton onClick={exportSummary} label="Export CSV" />
          </>
        }
      />

      <div className="fin-stats fin-stats-4">
        <StatCard
          label={`Cost · ${scopeLabel}`}
          value={money(view === "period" ? periodSpend : allSpend)}
          sub={`${rows.length} cost entries`}
          icon={<IconBox />}
        />
        <StatCard
          label="Subcontractor Cost"
          value={money(contractorSpend)}
          sub={`${formatPercent(contractorSpend, view === "period" ? periodSpend : allSpend)}% of scope cost`}
          icon={<IconTeam />}
        />
        <StatCard
          label="Machinery & Equipment"
          value={money(machinerySpend)}
          sub="Hire, fuel and plant"
          icon={<IconClipboard />}
        />
        <StatCard
          label="Contract Consumed"
          value={`${formatPercent(totalProjectSpend, site.contractValue)}%`}
          sub={`${money(totalProjectSpend)} of ${money(site.contractValue)}`}
          icon={<IconBuilding />}
        />
        <StatCard
          label="Project Budget Used"
          value={`${formatPercent(totalProjectSpend, totalProjectBudget)}%`}
          sub={`${money(totalProjectBudget)} allocated`}
          icon={<IconChart />}
        />
        <StatCard
          label="Pending Approval"
          value={money(totals.pendingExpenses)}
          sub="Not yet in approved cost"
          icon={<IconClock />}
        />
      </div>

      <Card title="Cost Mix by Group" subtitle={`Composition of ${money(view === "period" ? periodSpend : allSpend)}`}>
        {donutData.length > 0 ? (
          <DonutChart data={donutData} height={300} currency={cur} />
        ) : (
          <p className="fin-empty">No cost entries for this scope.</p>
        )}
      </Card>

      <div className="fin-grid-2">
        <Card title="Group Spend" subtitle="Absolute cost by construction cost group">
          {barData.length > 0 ? (
            <CategoryBarChart data={barData} dataKey="amount" currency={cur} height={300} />
          ) : (
            <p className="fin-empty">No cost entries for this scope.</p>
          )}
        </Card>

        <Card title="Top Cost Heads" subtitle="Highest-value individual bookings">
          {topHeads.length > 0 ? (
            <DepartmentBarChart data={topHeads} currency={cur} height={300} />
          ) : (
            <p className="fin-empty">No cost entries for this scope.</p>
          )}
        </Card>
      </div>

      <Card
        title="Monthly Cost Curve"
        subtitle="Booked site cost and resulting cash position by month"
      >
        {trendData.length > 0 ? (
          <MonthlyTrendChart data={trendData} height={300} />
        ) : (
          <p className="fin-empty">Not enough history to plot a trend.</p>
        )}
      </Card>

      <div className="fin-grid-2">
        <Card title="Supplier & Subcontractor Spend" subtitle="Who the site paid, by value">
          {payeeData.length > 0 ? (
            <DepartmentBarChart data={payeeData} currency={cur} height={300} />
          ) : (
            <p className="fin-empty">No cost entries for this scope.</p>
          )}
        </Card>

        <Card title="Project Performance" subtitle="Budget consumed against allocation">
          <div className="fin-table-wrap">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th className="num">Budget</th>
                  <th className="num">Spent</th>
                  <th className="num">Used</th>
                </tr>
              </thead>
              <tbody>
                {projectTotals.map((p) => (
                  <tr key={p.project.id}>
                    <td data-label="Project">
                      <div className="fin-cell-stack">
                        <strong>{p.project.name}</strong>
                        <span className="fin-mono">{p.project.code}</span>
                      </div>
                    </td>
                    <td data-label="Budget" className="num fin-amount">
                      {money(p.budget)}
                    </td>
                    <td data-label="Spent" className="num fin-amount">
                      {money(p.spent)}
                    </td>
                    <td data-label="Used" className="num">
                      {p.used}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ---- Group matrix ---- */}
      <Card
        title="Cost Group Matrix"
        subtitle={`All ${COST_GROUPS.length} construction cost groups tracked for ${site.name}`}
      >
        <div className="fin-table-wrap">
          <table className="fin-table">
            <thead>
              <tr>
                <th>Cost Group</th>
                <th className="num">Entries</th>
                <th className="num">Amount</th>
                <th className="num">Share</th>
                <th className="num">Avg per entry</th>
              </tr>
            </thead>
            <tbody>
              {COST_GROUPS.map((g) => {
                const hit = groupTotals.find((x) => x.group === g);
                return (
                  <tr key={g} className={hit ? "" : "fin-row-dim"}>
                    <td data-label="Cost Group">
                      <span
                        className="fin-chip"
                        style={{
                          borderLeftColor: GROUP_COLOUR[g],
                          borderLeftWidth: 3,
                        }}
                      >
                        {g}
                      </span>
                    </td>
                    <td data-label="Entries" className="num">
                      {hit?.count ?? 0}
                    </td>
                    <td data-label="Amount" className="num fin-amount">
                      {money(hit?.amount ?? 0)}
                    </td>
                    <td data-label="Share" className="num">
                      {hit?.share ?? 0}%
                    </td>
                    <td data-label="Avg per entry" className="num">
                      {hit && hit.count > 0 ? money(Math.round(hit.amount / hit.count)) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>Total · {scopeLabel}</td>
                <td className="num">{rows.length}</td>
                <td className="num fin-amount">{money(view === "period" ? periodSpend : allSpend)}</td>
                <td className="num">100%</td>
                <td className="num">
                  {rows.length ? money(Math.round((view === "period" ? periodSpend : allSpend) / rows.length)) : "—"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* ---- Report metadata ---- */}
      <div className="fin-kv-strip">
        <div>
          <span>Site</span>
          <strong>
            {site.name}, {site.state}, {site.country}
          </strong>
        </div>
        <div>
          <span>Reporting scope</span>
          <strong>{scopeLabel}</strong>
        </div>
        <div>
          <span>Projects covered</span>
          <strong>
            {projects.length} · {projectTotals.length} with cost
          </strong>
        </div>
        <div>
          <span>Site currency</span>
          <strong>{cur}</strong>
        </div>
        <div>
          <span>Group INR value</span>
          <strong>
            {cur === "INR"
              ? formatINR(totalProjectSpend)
              : formatINR(totalProjectSpend * site.exchangeRate)}
          </strong>
        </div>
      </div>

      <div className="fin-report-actions">
        <button
          className="fin-btn fin-btn-ghost"
          onClick={() => {
            pushToast("PDF export", "PDF generation is a placeholder in this prototype.", "info");
          }}
        >
          Export PDF
        </button>
        <button className="fin-btn fin-btn-ghost" onClick={() => open("expense")}>
          Record Expense
        </button>
      </div>

      <p className="fin-prototype-note">
        Prototype only. Every figure above is derived from the same local cost records shown on the
        Site Expenses page, so these reports cannot disagree with the register. Report generated{" "}
        {formatDate("2026-09-30")} for {site.name}. Site finance is maintained separately from Office
        finance.
      </p>
    </>
  );
}
