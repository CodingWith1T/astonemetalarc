"use client";

import { useState } from "react";
import { Office, formatDate, formatINR, type OfficeAsset } from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { useOfficeUI } from "../../_components/OfficeShell";
import {
  AmountCell,
  Card,
  FiltersBar,
  PageHead,
  SortHeader,
  StatCard,
  TotalsFooter,
  useTableControls,
  type FilterDef,
} from "@/app/admin/_lib/finance/table-kit";
import { DetailRow, Drawer, EmptyState, IconBox, IconPlus, IconScale, IconShield, StatusBadge } from "@/app/admin/_lib/finance/ui";

const FILTERS: FilterDef[] = [
  { key: "category", label: "Category", options: ["IT", "Equipment", "Furniture", "Vehicle", "Appliance", "Security"] },
  { key: "status", label: "Status", options: ["Active", "Assigned", "In Storage", "Maintenance", "Lost", "Disposed"], allLabel: "All Status" },
  { key: "assignedTo", label: "Assigned To", options: ["Accountant", "Admin Executive", "HR Executive", "IT Executive", "Sales Executive", "—"], allLabel: "All Users" },
];

export default function OfficeAssetsClient() {
  const { assets } = useOffice();
  const { open } = useOfficeUI();
  const [viewing, setViewing] = useState<OfficeAsset | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: assets as unknown as Record<string, unknown>[],
    pageSize: 10,
    searchFields: (r) => [String(r.assetId), String(r.name), String(r.serialNumber), String(r.vendor), String(r.assignedTo)],
    filters: FILTERS,
    defaultSort: { key: "assetId", dir: "asc" },
  });

  const totalValue = assets.reduce((s, a) => s + a.cost, 0);
  const activeCount = assets.filter((a) => a.status === "Active" || a.status === "Assigned").length;

  return (
    <div className="fin-page">
      <PageHead
        title="Office Assets"
        subtitle={`${Office.shortName} · Office asset register`}
        actions={
          <button className="fin-btn fin-btn-primary" onClick={() => open("asset")}>
            <IconPlus /> Add Asset
          </button>
        }
      />

      <div className="fin-stats fin-stats-4">
        <StatCard label="Total Assets" value={String(assets.length)} icon={<IconBox size={18} />} sub="Registered items" />
        <StatCard label="Total Value" value={formatINR(totalValue)} icon={<IconScale size={18} />} sub="Purchase cost basis" />
        <StatCard label="In Use" value={String(activeCount)} icon={<IconShield size={18} />} trend="Active or assigned" trendTone="up" />
        <StatCard
          label="Under Maintenance"
          value={String(assets.filter((a) => a.status === "Maintenance").length)}
          icon={<IconBox size={18} />}
          trend="Servicing due"
          trendTone="down"
        />
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="fin-table-wrap">
        <div className="fin-table-scroll">
          <table className="fin-table">
            <thead>
              <tr>
                <SortHeader label="Asset ID" sortKey="assetId" controls={controls} />
                <SortHeader label="Asset" sortKey="name" controls={controls} />
                <SortHeader label="Category" sortKey="category" controls={controls} />
                <SortHeader label="Assigned To" sortKey="assignedTo" controls={controls} />
                <SortHeader label="Purchase Date" sortKey="purchaseDate" controls={controls} />
                <SortHeader label="Cost" sortKey="cost" controls={controls} align="right" />
                <SortHeader label="Status" sortKey="status" controls={controls} />
                <th className="fin-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No assets found"
                      message="No assets match the current filters."
                      action={
                        <button className="fin-btn fin-btn-primary" onClick={() => open("asset")}>
                          <IconPlus /> Add Asset
                        </button>
                      }
                    />
                  </td>
                </tr>
              )}
              {controls.pageRows.map((r) => {
                const a = r as unknown as OfficeAsset;
                return (
                  <tr key={a.id} className="fin-row-click" onClick={() => setViewing(a)}>
                    <td className="fin-mono">{a.assetId}</td>
                    <td>
                      <span className="fin-cell-title">{a.name}</span>
                      <span className="fin-cell-sub">{a.serialNumber}</span>
                    </td>
                    <td><span className="fin-chip">{a.category}</span></td>
                    <td>{a.assignedTo}</td>
                    <td className="fin-strong">{formatDate(a.purchaseDate)}</td>
                    <td className="fin-td-right"><AmountCell amount={a.cost} /></td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="fin-td-center">
                      <button
                        className="fin-row-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewing(a);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TotalsFooter label={`${controls.total} assets`} amount={controls.sum} note="Purchase cost" />
      </div>

      <Card title="Asset Status Definitions" subtitle="Lifecycle used across the office asset register">
        <div className="fin-cat-grid">
          {[
            ["Active", "In use by the office and available for daily work."],
            ["Assigned", "Issued to a specific employee and tracked against their name."],
            ["In Storage", "Owned by the office but not currently deployed."],
            ["Maintenance", "Under repair or servicing — not usable right now."],
            ["Lost", "Reported missing; audit trail is retained."],
            ["Disposed", "Written off or sold; kept in the register for history."],
          ].map(([s, d]) => (
            <div key={s} className="fin-cat-card">
              <StatusBadge status={s} />
              <p style={{ marginTop: 8 }}>{d}</p>
            </div>
          ))}
        </div>
      </Card>

      {viewing && (
        <Drawer
          open
          title={`${viewing.assetId} — ${viewing.name}`}
          subtitle={`${viewing.category} · ${viewing.status}`}
          onClose={() => setViewing(null)}
          footer={
            <div className="fin-drawer-actions">
              <button className="fin-btn fin-btn-primary" onClick={() => setViewing(null)}>
                Close
              </button>
            </div>
          }
        >
          <div className="fin-drawer-hero">
            <div>
              <span className="fin-drawer-hero-label">Purchase Cost</span>
              <strong className="fin-drawer-hero-amount">{formatINR(viewing.cost)}</strong>
            </div>
            <StatusBadge status={viewing.status} />
          </div>

          <div className="fin-detail-list">
            <DetailRow label="Asset ID" value={viewing.assetId} />
            <DetailRow label="Asset Name" value={viewing.name} />
            <DetailRow label="Category" value={viewing.category} />
            <DetailRow label="Assigned To" value={viewing.assignedTo} />
            <DetailRow label="Purchase Date" value={formatDate(viewing.purchaseDate)} />
            <DetailRow label="Purchase Cost" value={formatINR(viewing.cost)} />
            <DetailRow label="Vendor" value={viewing.vendor} />
            <DetailRow label="Serial Number" value={viewing.serialNumber} />
            <DetailRow label="Warranty Expiry" value={viewing.warrantyExpiry} />
            <DetailRow label="Status" value={<StatusBadge status={viewing.status} />} />
            <DetailRow label="Invoice" value={viewing.invoice} />
            <DetailRow label="Notes" value={viewing.notes || "—"} />
          </div>
        </Drawer>
      )}
    </div>
  );
}
