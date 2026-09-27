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
} from "../../_components/table-kit";
import { DetailRow, Drawer, EmptyState, IconBox, IconPlus, IconScale, IconShield, StatusBadge } from "../../_components/ui";

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
    <div className="of-page">
      <PageHead
        title="Office Assets"
        subtitle={`${Office.shortName} · Office asset register`}
        actions={
          <button className="of-btn of-btn-primary" onClick={() => open("asset")}>
            <IconPlus /> Add Asset
          </button>
        }
      />

      <div className="of-stats of-stats-4">
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

      <div className="of-table-wrap">
        <div className="of-table-scroll">
          <table className="of-table">
            <thead>
              <tr>
                <SortHeader label="Asset ID" sortKey="assetId" controls={controls} />
                <SortHeader label="Asset" sortKey="name" controls={controls} />
                <SortHeader label="Category" sortKey="category" controls={controls} />
                <SortHeader label="Assigned To" sortKey="assignedTo" controls={controls} />
                <SortHeader label="Purchase Date" sortKey="purchaseDate" controls={controls} />
                <SortHeader label="Cost" sortKey="cost" controls={controls} align="right" />
                <SortHeader label="Status" sortKey="status" controls={controls} />
                <th className="of-th-center">Actions</th>
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
                        <button className="of-btn of-btn-primary" onClick={() => open("asset")}>
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
                  <tr key={a.id} className="of-row-click" onClick={() => setViewing(a)}>
                    <td className="of-mono">{a.assetId}</td>
                    <td>
                      <span className="of-cell-title">{a.name}</span>
                      <span className="of-cell-sub">{a.serialNumber}</span>
                    </td>
                    <td><span className="of-chip">{a.category}</span></td>
                    <td>{a.assignedTo}</td>
                    <td className="of-strong">{formatDate(a.purchaseDate)}</td>
                    <td className="of-td-right"><AmountCell amount={a.cost} /></td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="of-td-center">
                      <button
                        className="of-row-btn"
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
        <div className="of-cat-grid">
          {[
            ["Active", "In use by the office and available for daily work."],
            ["Assigned", "Issued to a specific employee and tracked against their name."],
            ["In Storage", "Owned by the office but not currently deployed."],
            ["Maintenance", "Under repair or servicing — not usable right now."],
            ["Lost", "Reported missing; audit trail is retained."],
            ["Disposed", "Written off or sold; kept in the register for history."],
          ].map(([s, d]) => (
            <div key={s} className="of-cat-card">
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
            <div className="of-drawer-actions">
              <button className="of-btn of-btn-primary" onClick={() => setViewing(null)}>
                Close
              </button>
            </div>
          }
        >
          <div className="of-drawer-hero">
            <div>
              <span className="of-drawer-hero-label">Purchase Cost</span>
              <strong className="of-drawer-hero-amount">{formatINR(viewing.cost)}</strong>
            </div>
            <StatusBadge status={viewing.status} />
          </div>

          <div className="of-detail-list">
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
