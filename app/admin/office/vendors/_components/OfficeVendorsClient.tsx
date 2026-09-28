"use client";

import { useMemo, useState } from "react";
import { Office, formatDate, formatINR, type OfficeVendor } from "../../_lib/office-data";
import { outstandingOf, useOffice } from "../../_lib/OfficeContext";
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
import { DetailRow, Drawer, EmptyState, IconBuilding, IconPlus, IconScale, IconStore, StatusBadge } from "@/app/admin/_lib/finance/ui";

const FILTERS: FilterDef[] = [
  {
    key: "category",
    label: "Category",
    options: ["Rent & Property", "Internet & Telecom", "Stationery & Supplies", "Printing", "Maintenance & HVAC", "IT Hardware & Software", "Professional — Accounting", "Professional — Legal", "Security", "Transport"],
    allLabel: "All Categories",
  },
  { key: "status", label: "Status", options: ["Active", "Inactive"] },
];

export default function OfficeVendorsClient() {
  const { vendors } = useOffice();
  const { open } = useOfficeUI();
  const [viewing, setViewing] = useState<OfficeVendor | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: vendors as unknown as Record<string, unknown>[],
    pageSize: 10,
    searchFields: (r) => [String(r.name), String(r.contactPerson), String(r.category), String(r.email), String(r.phone)],
    filters: FILTERS,
    defaultSort: { key: "name", dir: "asc" },
  });

  const rows = useMemo(
    () =>
      controls.pageRows.map((r) => {
        const v = r as unknown as OfficeVendor;
        const totalPaid = v.transactions.reduce((s, t) => s + t.amount, 0);
        return { vendor: v, totalPaid, outstanding: outstandingOf(v) };
      }),
    [controls.pageRows]
  );

  const totalPaid = vendors.reduce(
    (s, v) => s + v.transactions.reduce((a, t) => a + t.amount, 0),
    0
  );
  const totalOutstanding = vendors.reduce((s, v) => s + outstandingOf(v), 0);

  return (
    <div className="fin-page">
      <PageHead
        title="Office Vendors"
        subtitle={`${Office.shortName} · Vendors, suppliers and service providers`}
        actions={
          <button className="fin-btn fin-btn-primary" onClick={() => open("vendor")}>
            <IconPlus /> Add Vendor
          </button>
        }
      />

      <div className="fin-stats fin-stats-3">
        <StatCard label="Total Vendors" value={String(vendors.length)} icon={<IconBuilding size={18} />} sub="Office vendor register" />
        <StatCard label="Total Paid" value={formatINR(totalPaid)} icon={<IconStore size={18} />} sub="Across all vendors" />
        <StatCard label="Outstanding" value={formatINR(totalOutstanding)} icon={<IconScale size={18} />} sub="Pending payables" />
      </div>

      <FiltersBar controls={controls} filters={FILTERS} />

      <div className="fin-table-wrap">
        <div className="fin-table-scroll">
          <table className="fin-table">
            <thead>
              <tr>
                <SortHeader label="Vendor" sortKey="name" controls={controls} />
                <SortHeader label="Category" sortKey="category" controls={controls} />
                <th>Contact</th>
                <th className="fin-th-right">Total Paid</th>
                <th className="fin-th-right">Outstanding</th>
                <th>Status</th>
                <th className="fin-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No vendors found"
                      message="No vendors match the current filters."
                      action={
                        <button className="fin-btn fin-btn-primary" onClick={() => open("vendor")}>
                          <IconPlus /> Add Vendor
                        </button>
                      }
                    />
                  </td>
                </tr>
              )}
              {rows.map(({ vendor, totalPaid: paid, outstanding }) => (
                <tr key={vendor.id} className="fin-row-click" onClick={() => setViewing(vendor)}>
                  <td>
                    <span className="fin-cell-title">{vendor.name}</span>
                    <span className="fin-cell-sub">{vendor.gstNumber}</span>
                  </td>
                  <td><span className="fin-chip">{vendor.category}</span></td>
                  <td>
                    <span className="fin-cell-title">{vendor.contactPerson}</span>
                    <span className="fin-cell-sub">{vendor.phone}</span>
                  </td>
                  <td className="fin-td-right"><AmountCell amount={paid} /></td>
                  <td className="fin-td-right">
                    {outstanding > 0 ? <span className="fin-amount out">{formatINR(outstanding)}</span> : <span className="fin-muted">—</span>}
                  </td>
                  <td><StatusBadge status={vendor.status} /></td>
                  <td className="fin-td-center">
                    <button
                      className="fin-row-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewing(vendor);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TotalsFooter label={`${controls.total} vendors`} amount={rows.reduce((s, r) => s + r.totalPaid, 0)} />
      </div>

      {viewing && (
        <Drawer
          open
          title={viewing.name}
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
          <div className="fin-profile-stats" style={{ borderRadius: 12, borderTop: "1px solid var(--fin-border)" }}>
            <div>
              <span>Total Paid</span>
              <strong>{formatINR(viewing.transactions.reduce((s, t) => s + t.amount, 0))}</strong>
            </div>
            <div>
              <span>Outstanding</span>
              <strong style={{ color: outstandingOf(viewing) ? "#dc2626" : undefined }}>{formatINR(outstandingOf(viewing))}</strong>
            </div>
          </div>

          <div className="fin-section-title">
            <h3>Vendor Profile</h3>
          </div>
          <div className="fin-detail-list">
            <DetailRow label="Vendor Name" value={viewing.name} />
            <DetailRow label="Category" value={viewing.category} />
            <DetailRow label="Contact Person" value={viewing.contactPerson} />
            <DetailRow label="Phone" value={viewing.phone} />
            <DetailRow label="Email" value={viewing.email} />
            <DetailRow label="Address" value={viewing.address} />
            <DetailRow label="Payment Terms" value={viewing.paymentTerms} />
            <DetailRow label="GST Number" value={viewing.gstNumber} />
            <DetailRow label="Status" value={<StatusBadge status={viewing.status} />} />
          </div>

          <div className="fin-section-title">
            <h3>Transaction History</h3>
          </div>
          {viewing.transactions.length === 0 ? (
            <Card title="No transactions yet" subtitle="Payments to this vendor will appear here">
              <EmptyState title="No transactions" message="This vendor has no office payment history yet." />
            </Card>
          ) : (
            <div className="fin-profile-list fin-vendor-tx">
              {viewing.transactions.map((t) => (
                <div key={t.reference + t.date} className="fin-vendor-tx-row">
                  <div>
                    <strong>{t.description}</strong>
                    <span>
                      {formatDate(t.date)} · {t.reference} · {t.mode}
                    </span>
                  </div>
                  <span className="fin-amount">{formatINR(t.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
}
