"use client";

import { useState } from "react";
import { Office, formatDateShort, formatINR } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { useOfficeUI } from "../../_components/OfficeShell";
import { Card, FiltersBar, PageHead, SortHeader, StatCard, TotalsFooter, useTableControls, type FilterDef } from "../../_components/table-kit";
import { EmptyState, IconCash, IconPlus, IconScale, IconWallet } from "../../_components/ui";

const FILTERS: FilterDef[] = [
  { key: "category", label: "Category", options: ["Stationery", "Office Supplies", "Printing", "Local Transportation", "Toll", "Cleaning", "Maintenance", "Other", "Cash Added"], allLabel: "All Categories" },
  { key: "addedBy", label: "Added By", options: ["Accountant", "Admin Executive"], allLabel: "All Users" },
];

export default function PettyCashClient() {
  const { pettyCash, pettyCashOpening, pettyCashAdded, pettyCashSpent, pettyCashBalance } = useOffice();
  const { open } = useOfficeUI();
  const [highlight, setHighlight] = useState<string | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: pettyCash as unknown as Record<string, unknown>[],
    pageSize: 12,
    searchFields: (r) => [String(r.description), String(r.category), String(r.reference), String(r.addedBy)],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "asc" },
  });

  return (
    <div className="of-page">
      <PageHead
        title="Petty Cash"
        subtitle={`${Office.shortName} · Office → Petty Cash`}
        actions={
          <button className="of-btn of-btn-primary" onClick={() => open("pettyCash")}>
            <IconPlus /> Add Cash Transaction
          </button>
        }
      />

      <div className="of-stats of-stats-4">
        <StatCard label="Opening Balance" value={formatINR(pettyCashOpening)} icon={<IconWallet size={18} />} sub="Float at start of month" />
        <StatCard label="Cash Added" value={formatINR(pettyCashAdded)} icon={<IconCash size={18} />} trend="Top-ups received" trendTone="up" />
        <StatCard label="Cash Spent" value={formatINR(pettyCashSpent)} icon={<IconScale size={18} />} trend="Vouchers paid" trendTone="down" />
        <StatCard label="Current Cash Balance" value={formatINR(pettyCashBalance)} icon={<IconCash size={18} />} sub="Opening + added − spent" />
      </div>

      <Card title="Petty Cash Formula" subtitle="Running balance is calculated after every transaction">
        <div className="of-formula-bar">
          <span className="of-formula-part">{formatINR(pettyCashOpening)}</span>
          <span className="of-formula-op">+</span>
          <span className="of-formula-part">{formatINR(pettyCashAdded)}</span>
          <span className="of-formula-op">−</span>
          <span className="of-formula-part">{formatINR(pettyCashSpent)}</span>
          <span className="of-formula-op">=</span>
          <span className="of-formula-part is-result">{formatINR(pettyCashBalance)}</span>
        </div>
        <div className="of-note">
          Petty cash is a separate cash float for the Ghaziabad office. It is <strong>not</strong> merged with the
          office bank balance ledger or with construction site cash.
        </div>
      </Card>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="of-table-wrap">
        <div className="of-table-scroll">
          <table className="of-table">
            <thead>
              <tr>
                <SortHeader label="Date" sortKey="date" controls={controls} />
                <th>Description</th>
                <SortHeader label="Category" sortKey="category" controls={controls} />
                <SortHeader label="Cash In" sortKey="cashIn" controls={controls} align="right" />
                <SortHeader label="Cash Out" sortKey="cashOut" controls={controls} align="right" />
                <SortHeader label="Balance" sortKey="balance" controls={controls} align="right" />
                <SortHeader label="Added By" sortKey="addedBy" controls={controls} />
                <th>Voucher</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState title="No petty cash entries" message="Add a cash transaction to start the petty cash ledger." />
                  </td>
                </tr>
              )}
              {controls.pageRows.map((r) => {
                const p = r as unknown as (typeof pettyCash)[number];
                return (
                  <tr
                    key={p.id}
                    className={`of-row-click${highlight === p.id ? " active" : ""}`}
                    onClick={() => setHighlight(highlight === p.id ? null : p.id)}
                  >
                    <td className="of-strong">{formatDateShort(p.date)}</td>
                    <td>
                      <span className="of-cell-title">{p.description}</span>
                    </td>
                    <td><span className="of-chip">{p.category}</span></td>
                    <td className="of-td-right">{p.cashIn ? <span className="of-amount in">+{formatINR(p.cashIn)}</span> : <span className="of-muted">—</span>}</td>
                    <td className="of-td-right">{p.cashOut ? <span className="of-amount out">−{formatINR(p.cashOut)}</span> : <span className="of-muted">—</span>}</td>
                    <td className="of-td-right"><span className="of-amount balance">{formatINR(p.balance)}</span></td>
                    <td>{p.addedBy}</td>
                    <td className="of-mono">{p.reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TotalsFooter label={`Total — ${controls.total} entries`} amount={controls.sum} note="Cash out total" />
      </div>
    </div>
  );
}
