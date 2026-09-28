"use client";

import {
  ExportButton,
  FiltersBar,
  PageHead,
  StatCard,
  useTableControls,
  type FilterDef,
} from "@/app/admin/_lib/finance/table-kit";
import {
  EmptyState,
  IconChart,
  IconClipboard,
  IconScale,
  IconWallet,
} from "@/app/admin/_lib/finance/ui";
import { FundsFlowChart } from "@/app/admin/_lib/finance/charts";
import { downloadCSV } from "@/app/admin/_lib/finance/csv";
import { formatDate, formatMoney } from "@/app/admin/_lib/finance/format";
import { useSiteFinance } from "../../_lib/SiteFinanceContext";
import { useSiteFinanceUI } from "../../_components/SiteFinanceShell";
import type { LedgerKind } from "@/app/admin/_lib/finance/sites-data";

const FILTERS: FilterDef[] = [
  {
    key: "kind",
    label: "Entry Type",
    allLabel: "All entries",
    options: ["OPENING", "REMITTANCE", "EXPENSE"],
  },
  { key: "currency", label: "Currency", options: ["INR", "USD"] },
];

const KIND_LABEL: Record<LedgerKind, string> = {
  OPENING: "Opening",
  REMITTANCE: "Remittance",
  EXPENSE: "Site Cost",
};

const KIND_CHIP: Record<LedgerKind, string> = {
  OPENING: "slate",
  REMITTANCE: "blue",
  EXPENSE: "orange",
};

export default function SiteBalanceLedgerClient() {
  const { site, ledger, totals, pushToast } = useSiteFinance();
  const { openExpense } = useSiteFinanceUI();

  const controls = useTableControls({
    rows: ledger,
    pageSize: 15,
    // The OPENING row has no date, so it is matched on narration/reference instead.
    searchFields: (r) => [r.reference, r.narration, r.kind],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "asc" },
  });

  const cur = site.currency;
  const money = (n: number) => formatMoney(n, cur);

  const remittanceIn = ledger.filter((r) => r.kind === "REMITTANCE").reduce((s, r) => s + r.inflow, 0);
  const expenseOut = ledger.filter((r) => r.kind === "EXPENSE").reduce((s, r) => s + r.outflow, 0);
  const lastRow = ledger[ledger.length - 1];

  /* Footer cross-check is computed over the *filtered* rows, not the page slice. */
  const filteredIn = controls.sorted.reduce((s, r) => s + r.inflow, 0);
  const filteredOut = controls.sorted.reduce((s, r) => s + r.outflow, 0);

  const exportCSV = () => {
    downloadCSV(
      `balance-ledger-${site.name.toLowerCase()}.csv`,
      ["Date", "Type", "Reference", "Narration", "Inflow", "Outflow", "Balance", "Currency"],
      controls.sorted.map((r) => [
        r.date,
        KIND_LABEL[r.kind],
        r.reference,
        r.narration,
        String(r.inflow),
        String(r.outflow),
        String(r.balance),
        r.currency,
      ])
    );
    pushToast("Export ready", `CSV of ${controls.total} ledger entries downloaded.`, "info");
  };

  return (
    <>
      <PageHead
        title="Site Balance Ledger"
        subtitle={`Running cash position for ${site.name} · opening balance, remittances and site costs in date order`}
        actions={<ExportButton onClick={exportCSV} label="Export CSV" />}
      />

      <div className="fin-stats fin-stats-4">
        <StatCard
          label="Opening Balance"
          value={money(totals.openingBalance)}
          sub="Carried forward into this period"
          icon={<IconClipboard />}
        />
        <StatCard
          label="Total Inflow"
          value={money(remittanceIn)}
          sub={`${ledger.filter((r) => r.kind === "REMITTANCE").length} remittances`}
          icon={<IconScale />}
        />
        <StatCard
          label="Total Outflow"
          value={money(expenseOut)}
          sub={`${ledger.filter((r) => r.kind === "EXPENSE").length} site costs`}
          icon={<IconChart />}
        />
        <StatCard
          label="Closing Balance"
          value={money(totals.closingBalance)}
          sub={lastRow ? `As at ${formatDate(lastRow.date)}` : "No activity"}
          icon={<IconWallet />}
        />
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      {controls.total === 0 ? (
        <EmptyState
          title="No ledger entries match"
          message="Adjust the filters to see remittances and site costs for this site."
        />
      ) : (
        <div className="fin-table-wrap">
          <table className="fin-table fin-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reference</th>
                <th>Narration</th>
                <th className="num">Inflow</th>
                <th className="num">Outflow</th>
                <th className="num">Balance</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.map((r) => (
                <tr
                  key={r.id}
                  className={r.kind === "OPENING" ? "fin-ledger-opening" : r.kind === "EXPENSE" ? "fin-row-click" : undefined}
                  onClick={r.expense ? () => openExpense(r.expense!.id) : undefined}
                >
                  <td data-label="Date">{r.date ? formatDate(r.date) : "—"}</td>
                  <td data-label="Type">
                    <span className={`fin-chip fin-chip-${KIND_CHIP[r.kind]}`}>{KIND_LABEL[r.kind]}</span>
                  </td>
                  <td data-label="Reference">
                    <span className="fin-mono">{r.reference}</span>
                  </td>
                  <td data-label="Narration">{r.narration}</td>
                  <td data-label="Inflow" className="num fin-amount fin-tone-positive">
                    {r.inflow ? `+${money(r.inflow)}` : "—"}
                  </td>
                  <td data-label="Outflow" className="num fin-amount fin-tone-negative">
                    {r.outflow ? `−${money(r.outflow)}` : "—"}
                  </td>
                  <td data-label="Balance" className={`num fin-amount${r.balance < 0 ? " fin-tone-negative" : ""}`}>
                    {money(r.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="fin-ledger-total">
                <td colSpan={4}>
                  Ledger cross-check · {controls.total} entr{controls.total === 1 ? "y" : "ies"}
                </td>
                <td className="num fin-amount fin-tone-positive">+{money(filteredIn)}</td>
                <td className="num fin-amount fin-tone-negative">−{money(filteredOut)}</td>
                <td className="num fin-amount">{money(filteredIn - filteredOut)}</td>
              </tr>
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
        </div>
      </div>

      <div className="fin-card">
        <header className="fin-card-head">
          <div>
            <h3>Cash Reconciliation</h3>
            <p>
              {money(totals.openingBalance)} opening + {money(remittanceIn)} remitted −{" "}
              {money(expenseOut)} spent = {money(totals.closingBalance)} closing
            </p>
          </div>
        </header>
        <div className="fin-card-body">
          <FundsFlowChart
            opening={totals.openingBalance}
            funds={remittanceIn}
            available={totals.openingBalance + remittanceIn}
            expenses={expenseOut}
            closing={totals.closingBalance}
            currency={cur}
          />
        </div>
      </div>

      <p className="fin-prototype-note">
        The running balance is computed once, in date order, from a single ledger — so the closing
        balance here always equals opening plus remittances minus site costs. The opening balance is
        shown as its own row and is deliberately excluded from total remittances, because it is
        carried-forward cash rather than a fresh transfer from Head Office.
      </p>
    </>
  );
}
