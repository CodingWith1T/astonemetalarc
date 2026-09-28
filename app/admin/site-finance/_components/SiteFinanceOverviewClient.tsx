"use client";

import {
  AddButton,
  Card,
  PageHead,
  StatCard,
} from "@/app/admin/_lib/finance/table-kit";
import {
  IconBuilding,
  IconBox,
  IconChart,
  IconClipboard,
  IconClock,
  IconScale,
  IconWallet,
} from "@/app/admin/_lib/finance/ui";
import { CategoryBarChart, DonutChart } from "@/app/admin/_lib/finance/charts";
import { formatDate, formatINR, formatMoney, formatPercent } from "@/app/admin/_lib/finance/format";
import { useSiteFinance } from "../_lib/SiteFinanceContext";
import { useSiteFinanceUI } from "../_components/SiteFinanceShell";
import { COST_GROUPS } from "@/app/admin/_lib/finance/sites-data";

const DONUT_COLOURS: Record<string, string> = {
  Labour: "#2563eb",
  Material: "#ea580c",
  Subcontractor: "#7c3aed",
  Machinery: "#059669",
  "Equipment Hire": "#0d9488",
  "Site Overheads": "#64748b",
  "Professional Fees": "#d97706",
};

export default function SiteFinanceOverviewClient() {
  const {
    site,
    projects,
    periodExpenses,
    priorPeriodExpenses,
    periodRemittances,
    totals,
    groupTotals,
    projectTotals,
    period,
  } = useSiteFinance();
  const { open } = useSiteFinanceUI();

  const cur = site.currency;
  const money = (n: number) => formatMoney(n, cur);

  const periodSpend = periodExpenses.reduce((s, e) => s + e.amount, 0);
  const priorSpend = priorPeriodExpenses.reduce((s, e) => s + e.amount, 0);
  const spendDelta = periodSpend - priorSpend;
  const spendTrend =
    priorSpend === 0
      ? "—"
      : `${spendDelta >= 0 ? "+" : ""}${formatPercent(spendDelta, priorSpend)}% vs ${priorPeriodExpenses[0]?.date.slice(0, 7) ?? "prior"}`;

  const periodRemit = periodRemittances.reduce((s, r) => s + r.amount, 0);
  const approved = periodExpenses.filter((e) => e.status === "Approved");
  const pending = periodExpenses.filter((e) => e.status === "Pending Approval");

  const totalProjectBudget = projectTotals.reduce((s, p) => s + p.budget, 0);
  const totalProjectSpend = projectTotals.reduce((s, p) => s + p.spent, 0);
  const overallUsed = formatPercent(totalProjectSpend, totalProjectBudget);
  const contractUsed = formatPercent(totalProjectSpend, site.contractValue);

  const donutData = groupTotals.map((g) => ({
    name: g.group,
    value: g.amount,
    fill: DONUT_COLOURS[g.group] ?? "#64748b",
  }));

  const barData = groupTotals.map((g) => ({ name: g.group, amount: g.amount }));

  const recent = [...periodExpenses].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7);

  return (
    <>
      <PageHead
        title={`${site.name} Site Finance`}
        subtitle={`${site.clientName} · ${site.projectCode} · ${projects.length} active project${projects.length === 1 ? "" : "s"} · managed by ${site.siteManager}`}
        actions={
          <>
            <AddButton label="Record Expense" onClick={() => open("expense")} />
            <AddButton label="Record Remittance" onClick={() => open("remittance")} />
          </>
        }
      />

      {/* ---- Site identity strip ---- */}
      <div className="fin-kv-strip">
        <div>
          <span>Client</span>
          <strong>{site.clientName}</strong>
        </div>
        <div>
          <span>Contract value</span>
          <strong>{money(site.contractValue)}</strong>
        </div>
        <div>
          <span>Site started</span>
          <strong>{formatDate(site.startedOn)}</strong>
        </div>
        <div>
          <span>Project budget</span>
          <strong>{money(totalProjectBudget)}</strong>
        </div>
        <div>
          <span>Site currency</span>
          <strong>{cur === "INR" ? "INR ₹" : "USD $"}</strong>
        </div>
      </div>

      {/* ---- Primary KPIs ---- */}
      <div className="fin-stats fin-stats-4">
        <StatCard
          label="Site Balance"
          value={money(totals.closingBalance)}
          sub={`Opening ${money(totals.openingBalance)}`}
          icon={<IconWallet />}
        />
        <StatCard
          label={`Remitted · ${period.label}`}
          value={money(totals.fundsReceived)}
          sub={`${periodRemittances.length} transfer${periodRemittances.length === 1 ? "" : "s"} this period`}
          icon={<IconScale />}
        />
        <StatCard
          label={`Site Cost · ${period.label}`}
          value={money(periodSpend)}
          trend={spendTrend}
          trendTone={spendDelta > 0 ? "up" : spendDelta < 0 ? "down" : "flat"}
          sub={`${periodExpenses.length} cost entries`}
          icon={<IconBox />}
        />
        <StatCard
          label="Cash Utilisation"
          value={`${totals.utilisation}%`}
          sub={`${money(totals.openingBalance + totals.fundsReceived)} available in period`}
          icon={<IconChart />}
        />
        <StatCard
          label="Contract Consumed"
          value={`${contractUsed}%`}
          sub={`${money(totalProjectSpend)} of ${money(site.contractValue)}`}
          icon={<IconBuilding />}
        />
        <StatCard
          label="Awaiting Approval"
          value={money(totals.pendingExpenses)}
          sub={`${pending.length} entr${pending.length === 1 ? "y" : "ies"} pending`}
          icon={<IconClock />}
        />
      </div>

      {/* ---- Cost structure ---- */}
      <div className="fin-grid-2">
        <Card
          title="Cost Structure by Group"
          subtitle={`Where ${money(periodSpend)} was spent in ${period.label}`}
        >
          {donutData.length > 0 ? (
            <DonutChart data={donutData} height={260} currency={cur} />
          ) : (
            <p className="fin-empty">No cost entries in this period.</p>
          )}
        </Card>

        <Card
          title="Group Comparison"
          subtitle="Absolute spend per construction cost group"
        >
          {barData.length > 0 ? (
            <CategoryBarChart data={barData} dataKey="amount" currency={cur} height={260} />
          ) : (
            <p className="fin-empty">No cost entries in this period.</p>
          )}
        </Card>
      </div>

      {/* ---- Group breakdown table ---- */}
      <Card
        title="Cost Group Summary"
        subtitle={`${COST_GROUPS.length} construction cost groups tracked for ${site.name}`}
      >
        <div className="fin-table-wrap">
          <table className="fin-table">
            <thead>
              <tr>
                <th>Cost Group</th>
                <th className="num">Entries</th>
                <th className="num">Amount</th>
                <th className="num">Share</th>
                <th>Distribution</th>
              </tr>
            </thead>
            <tbody>
              {groupTotals.map((g) => (
                <tr key={g.group}>
                  <td data-label="Cost Group">
                    <span
                      className="fin-chip"
                      style={{ borderLeftColor: DONUT_COLOURS[g.group], borderLeftWidth: 3 }}
                    >
                      {g.group}
                    </span>
                  </td>
                  <td data-label="Entries" className="num">
                    {g.count}
                  </td>
                  <td data-label="Amount" className="num fin-amount">
                    {money(g.amount)}
                  </td>
                  <td data-label="Share" className="num">
                    {g.share}%
                  </td>
                  <td data-label="Distribution">
                    <div className="fin-bar">
                      <span
                        style={{ width: `${Math.max(g.share, 1.5)}%`, background: DONUT_COLOURS[g.group] }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total · {period.label}</td>
                <td className="num fin-amount">{money(periodSpend)}</td>
                <td className="num">100%</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* ---- Project budget vs actual ---- */}
      <Card
        title="Project Budget vs Actual"
        subtitle="Allocated budget against booked cost to date"
      >
        <div className="fin-table-wrap">
          <table className="fin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Scope</th>
                <th className="num">Budget</th>
                <th className="num">Spent</th>
                <th className="num">Variance</th>
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
                  <td data-label="Scope" className="fin-scope-cell">
                    {p.project.scope}
                  </td>
                  <td data-label="Budget" className="num fin-amount">
                    {money(p.budget)}
                  </td>
                  <td data-label="Spent" className="num fin-amount">
                    {money(p.spent)}
                  </td>
                  <td
                    data-label="Variance"
                    className={`num fin-amount ${p.variance < 0 ? "fin-tone-negative" : "fin-tone-positive"}`}
                  >
                    {p.variance < 0 ? "−" : ""}
                    {money(Math.abs(p.variance))}
                  </td>
                  <td data-label="Used" className="num">
                    <div className="fin-progress">
                      <div className="fin-progress-track">
                        <div
                          className={`fin-progress-fill${p.used >= 90 ? " warn" : ""}`}
                          style={{ width: `${Math.min(p.used, 100)}%` }}
                        />
                      </div>
                      <span>{p.used}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>All projects</td>
                <td className="num fin-amount">{money(totalProjectBudget)}</td>
                <td className="num fin-amount">{money(totalProjectSpend)}</td>
                <td className={`num fin-amount${totalProjectBudget - totalProjectSpend < 0 ? " fin-tone-negative" : " fin-tone-positive"}`}>
                  {money(Math.abs(totalProjectBudget - totalProjectSpend))}
                </td>
                <td className="num">{overallUsed}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* ---- Recent activity + approvals ---- */}
      <div className="fin-grid-2">
        <Card title="Recent Site Costs" subtitle={`Latest entries in ${period.label}`}>
          {recent.length > 0 ? (
            <ul className="fin-activity">
              {recent.map((e) => (
                <li key={e.id}>
                  <span className="fin-activity-icon">
                    <IconBox size={15} />
                  </span>
                  <div className="fin-activity-body">
                    <strong>{e.head}</strong>
                    <span>
                      {e.projectId.toUpperCase()} · {e.paidTo} · {formatDate(e.date)}
                    </span>
                  </div>
                  <div className="fin-activity-amount">
                    <strong>{money(e.amount)}</strong>
                    <span className={`fin-chip fin-chip-${e.status === "Approved" ? "green" : e.status === "Rejected" ? "red" : "amber"}`}>
                      {e.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="fin-empty">No cost entries in this period.</p>
          )}
        </Card>

        <Card
          title="Approval Queue"
          subtitle={`${pending.length} entr${pending.length === 1 ? "y" : "ies"} awaiting sign-off · ${money(totals.pendingExpenses)}`}
        >
          {pending.length > 0 ? (
            <ul className="fin-activity">
              {pending.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <span className="fin-activity-icon warn">
                    <IconClipboard size={15} />
                  </span>
                  <div className="fin-activity-body">
                    <strong>{e.head}</strong>
                    <span>
                      {e.paidTo} · booked by {e.paidBy} · {formatDate(e.date)}
                    </span>
                  </div>
                  <div className="fin-activity-amount">
                    <strong>{money(e.amount)}</strong>
                    <span className="fin-chip fin-chip-amber">Pending</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="fin-empty">Nothing awaiting approval. All costs signed off.</p>
          )}
        </Card>
      </div>

      {/* ---- Site notes ---- */}
      <div className="fin-kv-strip">
        <div>
          <span>Approved cost · {period.label}</span>
          <strong>{money(approved.reduce((s, e) => s + e.amount, 0))}</strong>
        </div>
        <div>
          <span>Pending cost · {period.label}</span>
          <strong>{money(totals.pendingExpenses)}</strong>
        </div>
        <div>
          <span>Remitted this period</span>
          <strong>{money(periodRemit)}</strong>
        </div>
        <div>
          <span>Group INR value</span>
          <strong>
            {cur === "INR"
              ? formatINR(totals.closingBalance)
              : formatINR(totals.closingBalance * site.exchangeRate)}
          </strong>
        </div>
        <div>
          <span>Contract duration</span>
          <strong>
            {formatDate(site.startedOn)} → ongoing
          </strong>
        </div>
      </div>

      <p className="fin-prototype-note">
        Prototype only. Figures are local mock state for {site.name} and are not connected to a
        database, bank feed, or any live system. Site finance is maintained separately from Office
        finance.
      </p>
    </>
  );
}
