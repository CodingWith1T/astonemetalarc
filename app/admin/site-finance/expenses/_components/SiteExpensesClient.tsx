"use client";

import {
  AddButton,
  ExportButton,
  FiltersBar,
  PageHead,
  SortHeader,
  StatCard,
  TotalsFooter,
  useTableControls,
  type FilterDef,
} from "@/app/admin/_lib/finance/table-kit";
import {
  EmptyState,
  IconBox,
  IconChart,
  IconClipboard,
  IconClock,
  IconTeam,
  IconTrash,
} from "@/app/admin/_lib/finance/ui";
import { downloadCSV } from "@/app/admin/_lib/finance/csv";
import { formatDate, formatMoney, formatPercent } from "@/app/admin/_lib/finance/format";
import { COST_GROUPS, PAYMENT_METHODS } from "@/app/admin/_lib/finance/sites-data";
import { useSiteFinance } from "../../_lib/SiteFinanceContext";
import { useSiteFinanceUI } from "../../_components/SiteFinanceShell";
import type { SiteExpense } from "@/app/admin/_lib/finance/sites-data";

const FILTERS: FilterDef[] = [
  { key: "group", label: "Cost Group", options: [...COST_GROUPS] },
  {
    key: "status",
    label: "Status",
    allLabel: "All statuses",
    options: ["Approved", "Pending Approval", "Rejected"],
  },
  { key: "paymentMethod", label: "Payment Mode", options: [...PAYMENT_METHODS] },
];

const STATUS_CHIP: Record<SiteExpense["status"], string> = {
  Approved: "green",
  "Pending Approval": "amber",
  Rejected: "red",
};

export default function SiteExpensesClient() {
  const {
    site,
    projects,
    expenses,
    periodExpenses,
    totals,
    period,
    deleteExpense,
    pushToast,
    setConfirm,
  } = useSiteFinance();
  const { open, openExpense } = useSiteFinanceUI();

  const controls = useTableControls({
    rows: expenses,
    pageSize: 12,
    searchFields: (e) => [
      e.id,
      e.head,
      e.description,
      e.paidTo,
      e.paidBy,
      e.receiptNo ?? "",
      e.notes,
      projects.find((p) => p.id === e.projectId)?.code ?? "",
    ],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "desc" },
  });

  const cur = site.currency;
  const money = (n: number) => formatMoney(n, cur);
  const projectName = (id: string) => projects.find((p) => p.id === id);

  const periodSpend = periodExpenses.reduce((s, e) => s + e.amount, 0);
  const labourSpend = periodExpenses
    .filter((e) => e.group === "Labour")
    .reduce((s, e) => s + e.amount, 0);
  const materialSpend = periodExpenses
    .filter((e) => e.group === "Material")
    .reduce((s, e) => s + e.amount, 0);
  const topPayee = (() => {
    const m = new Map<string, number>();
    for (const e of periodExpenses) m.set(e.paidTo, (m.get(e.paidTo) ?? 0) + e.amount);
    return [...m.entries()].sort((a, b) => b[1] - a[1])[0];
  })();

  const confirmDelete = (e: SiteExpense) =>
    setConfirm({
      title: "Delete this expense?",
      message: `${e.head} — ${money(e.amount)} booked on ${formatDate(e.date)} will be removed from the site register. This cannot be undone.`,
      confirmLabel: "Delete expense",
      tone: "danger",
      onConfirm: () => deleteExpense(e.id),
    });

  const exportCSV = () => {
    downloadCSV(
      `site-expenses-${site.name.toLowerCase()}.csv`,
      ["ID", "Date", "Project", "Group", "Cost Head", "Description", "Paid To", "Amount", "Currency", "Mode", "Paid By", "Status", "Receipt"],
      controls.sorted.map((e) => [
        e.id,
        e.date,
        projectName(e.projectId)?.code ?? e.projectId,
        e.group,
        e.head,
        e.description,
        e.paidTo,
        String(e.amount),
        e.currency,
        e.paymentMethod,
        e.paidBy,
        e.status,
        e.receiptNo ?? "",
      ])
    );
    pushToast("Export ready", `CSV of ${controls.sorted.length} site costs downloaded.`, "info");
  };

  return (
    <>
      <PageHead
        title="Site Expenses"
        subtitle={`Construction cost booked against ${site.name} projects · ${expenses.length} entries recorded`}
        actions={
          <>
            <ExportButton onClick={exportCSV} label="Export CSV" />
            <AddButton label="Record Expense" onClick={() => open("expense")} />
          </>
        }
      />

      <div className="fin-stats fin-stats-4">
        <StatCard
          label={`Cost · ${period.label}`}
          value={money(periodSpend)}
          sub={`${periodExpenses.length} entries this period`}
          icon={<IconBox />}
        />
        <StatCard
          label="Material Spend"
          value={money(materialSpend)}
          sub={`${formatPercent(materialSpend, periodSpend)}% of period cost`}
          icon={<IconChart />}
        />
        <StatCard
          label="Labour Spend"
          value={money(labourSpend)}
          sub={`${formatPercent(labourSpend, periodSpend)}% of period cost`}
          icon={<IconTeam />}
        />
        <StatCard
          label="Awaiting Approval"
          value={money(totals.pendingExpenses)}
          sub={`${periodExpenses.filter((e) => e.status === "Pending Approval").length} entries pending`}
          icon={<IconClock />}
        />
        <StatCard
          label="Largest Payee"
          value={topPayee ? money(topPayee[1]) : money(0)}
          sub={topPayee ? topPayee[0] : "No entries this period"}
          icon={<IconClipboard />}
        />
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      {controls.total === 0 ? (
        <EmptyState
          title="No expenses match"
          message="Adjust the filters, or record a site cost to get started."
          action={
            <button className="fin-btn fin-btn-primary" onClick={() => open("expense")}>
              Record Expense
            </button>
          }
        />
      ) : (
        <div className="fin-table-wrap">
          <table className="fin-table">
            <thead>
              <tr>
                <SortHeader label="Date" sortKey="date" controls={controls} />
                <SortHeader label="Project" sortKey="projectId" controls={controls} />
                <SortHeader label="Cost Head" sortKey="head" controls={controls} />
                <th>Paid To</th>
                <SortHeader label="Amount" sortKey="amount" controls={controls} align="right" />
                <SortHeader label="Status" sortKey="status" controls={controls} />
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.map((e) => (
                <tr key={e.id} className="fin-row-click" onClick={() => openExpense(e.id)}>
                  <td data-label="Date">{formatDate(e.date)}</td>
                  <td data-label="Project">
                    <span className="fin-mono">{projectName(e.projectId)?.code ?? e.projectId}</span>
                  </td>
                  <td data-label="Cost Head">
                    <div className="fin-cell-stack">
                      <strong>{e.head}</strong>
                      <span>{e.description}</span>
                    </div>
                  </td>
                  <td data-label="Paid To">{e.paidTo}</td>
                  <td data-label="Amount" className="num fin-amount">
                    {money(e.amount)}
                  </td>
                  <td data-label="Status">
                    <span className={`fin-chip fin-chip-${STATUS_CHIP[e.status]}`}>{e.status}</span>
                  </td>
                  <td className="fin-td-right">
                    <button
                      className="fin-icon-btn fin-icon-danger"
                      aria-label={`Delete ${e.head}`}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        confirmDelete(e);
                      }}
                    >
                      <IconTrash size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <TotalsFooter
                label={`${controls.total} cost entr${controls.total === 1 ? "y" : "ies"} · ${period.label} total is ${money(periodSpend)}`}
                amount={controls.sum}
                currency={cur}
                note={`Across ${COST_GROUPS.length} cost groups`}
              />
            </tfoot>
          </table>
        </div>
      )}

      <div className="fin-pagination">
        <span>
          Showing {controls.pageRows.length} of {controls.total}
        </span>
        <div className="fin-pagination-controls">
          <button
            className="fin-btn fin-btn-ghost"
            disabled={controls.page <= 1}
            onClick={() => controls.setPage(controls.page - 1)}
          >
            Prev
          </button>
          <span>
            Page {controls.page} of {controls.pageCount}
          </span>
          <button
            className="fin-btn fin-btn-ghost"
            disabled={controls.page >= controls.pageCount}
            onClick={() => controls.setPage(controls.page + 1)}
          >
            Next
          </button>
          {controls.activeFilters > 0 && (
            <button className="fin-btn fin-btn-ghost" onClick={controls.reset}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="fin-prototype-note">
        Prototype only — costs are local mock state. Deleting a row mutates this browser session
        only and does not touch any real site accounting record. Click any row to open its detail,
        approval and document panel.
      </p>
    </>
  );
}
