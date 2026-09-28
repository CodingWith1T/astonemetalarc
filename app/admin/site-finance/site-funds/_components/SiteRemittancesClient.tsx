"use client";

import {
  ExportButton,
  FiltersBar,
  PageHead,
  SortHeader,
  StatCard,
  TotalsFooter,
  useTableControls,
  type FilterDef,
} from "@/app/admin/_lib/finance/table-kit";
import { EmptyState, IconScale, IconWallet, IconClock, IconChart } from "@/app/admin/_lib/finance/ui";
import { AddButton } from "@/app/admin/_lib/finance/table-kit";
import { FundsFlowChart } from "@/app/admin/_lib/finance/charts";
import { REMITTANCE_METHODS } from "@/app/admin/_lib/finance/sites-data";
import { downloadCSV } from "@/app/admin/_lib/finance/csv";
import { formatDate, formatMoney } from "@/app/admin/_lib/finance/format";
import { useSiteFinance } from "../../_lib/SiteFinanceContext";
import { useSiteFinanceUI } from "../../_components/SiteFinanceShell";

const FILTERS: FilterDef[] = [
  { key: "method", label: "Transfer Mode", options: [...REMITTANCE_METHODS] },
];

export default function SiteRemittancesClient() {
  const { site, remittances, totals, period, pushToast } = useSiteFinance();
  const { open } = useSiteFinanceUI();

  const controls = useTableControls({
    rows: remittances,
    searchFields: (r) => [r.reference, r.method, r.remittedBy, r.notes],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "desc" },
  });

  const cur = site.currency;
  const money = (n: number) => formatMoney(n, cur);
  const periodRemit = remittances
    .filter((r) => r.date >= period.from && r.date <= period.to)
    .reduce((s, r) => s + r.amount, 0);
  const largest = remittances.reduce(
    (m, r) => (r.amount > (m?.amount ?? 0) ? r : m),
    remittances[0]
  );

  const exportCSV = () => {
    downloadCSV(
      `site-remittances-${site.name.toLowerCase()}.csv`,
      ["Reference", "Date", "Amount", "Currency", "Mode", "Remitted By", "Notes"],
      controls.sorted.map((r) => [
        r.reference,
        r.date,
        String(r.amount),
        r.currency,
        r.method,
        r.remittedBy,
        r.notes,
      ])
    );
    pushToast("Export ready", `CSV of ${controls.sorted.length} remittances downloaded.`, "info");
  };

  return (
    <>
      <PageHead
        title="Site Remittances"
        subtitle={`Funds transferred from Head Office to ${site.name} · ${site.projectCode}`}
        actions={
          <>
            <ExportButton onClick={exportCSV} label="Export CSV" />
            <AddButton label="Record Remittance" onClick={() => open("remittance")} />
          </>
        }
      />

      <div className="fin-stats fin-stats-4">
        <StatCard
          label="Total Remitted"
          value={money(totals.fundsReceived)}
          sub={`${remittances.length} transfer${remittances.length === 1 ? "" : "s"} to date`}
          icon={<IconScale />}
        />
        <StatCard
          label={`Remitted · ${period.label}`}
          value={money(periodRemit)}
          sub="Received in reporting period"
          icon={<IconWallet />}
        />
        <StatCard
          label="Opening Balance"
          value={money(totals.openingBalance)}
          sub="Carried forward, not a remittance"
          icon={<IconClock />}
        />
        <StatCard
          label="Current Site Balance"
          value={money(totals.closingBalance)}
          sub={`${totals.utilisation}% of available cash utilised`}
          icon={<IconChart />}
        />
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      {controls.total === 0 ? (
        <EmptyState
          title="No remittances match"
          message="Adjust the filters, or record a remittance sent to this site."
        />
      ) : (
        <div className="fin-table-wrap">
          <table className="fin-table">
            <thead>
              <tr>
                <SortHeader label="Reference" sortKey="reference" controls={controls} />
                <SortHeader label="Date" sortKey="date" controls={controls} />
                <SortHeader label="Amount" sortKey="amount" controls={controls} align="right" />
                <SortHeader label="Mode" sortKey="method" controls={controls} />
                <th>Remitted By</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.map((r) => (
                <tr key={r.id}>
                  <td data-label="Reference">
                    <span className="fin-mono">{r.reference}</span>
                  </td>
                  <td data-label="Date">{formatDate(r.date)}</td>
                  <td data-label="Amount" className="num fin-amount fin-tone-positive">
                    +{money(r.amount)}
                  </td>
                  <td data-label="Mode">
                    <span className="fin-chip fin-chip-blue">{r.method}</span>
                  </td>
                  <td data-label="Remitted By">{r.remittedBy}</td>
                  <td data-label="Notes" className="fin-scope-cell">
                    {r.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <TotalsFooter
                label={`${controls.total} remittance${controls.total === 1 ? "" : "s"}`}
                amount={controls.sum}
                currency={cur}
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
        </div>
      </div>

      <div className="fin-card">
        <header className="fin-card-head">
          <div>
            <h3>Cash Position</h3>
            <p>Opening balance, remittances received and cash consumed at {site.name}</p>
          </div>
        </header>
        <div className="fin-card-body">
          <FundsFlowChart
            opening={totals.openingBalance}
            funds={totals.fundsReceived}
            available={totals.openingBalance + totals.fundsReceived}
            expenses={totals.totalExpenses}
            closing={totals.closingBalance}
            currency={cur}
          />
        </div>
      </div>

      {largest && (
        <p className="fin-prototype-note">
          Largest single transfer: <strong>{largest.reference}</strong> · {money(largest.amount)} via{" "}
          {largest.method} on {formatDate(largest.date)}. Prototype only — remittances are local mock
          state and no bank transfer is initiated.
        </p>
      )}
    </>
  );
}
