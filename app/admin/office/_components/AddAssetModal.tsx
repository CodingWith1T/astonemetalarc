"use client";

import { useState, type FormEvent } from "react";
import { ASSET_STATUSES, OFFICE, STAFF, type OfficeAsset } from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import { Modal, SectionTitle } from "./ui";

const ASSET_CATEGORIES = ["IT", "Equipment", "Furniture", "Vehicle", "Appliance", "Security"];

export default function AddAssetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addAsset, assets, vendors, toast } = useOffice();
  const [form, setForm] = useState({
    name: "",
    category: ASSET_CATEGORIES[0],
    purchaseDate: "2026-09-27",
    cost: "",
    vendor: "",
    serialNumber: "",
    assignedTo: "—",
    warrantyExpiry: "",
    status: "Active" as OfficeAsset["status"],
    invoice: "",
    notes: "",
  });

  const nextAssetId = `AST-${String(assets.length + 1).padStart(3, "0")}`;

  const reset = () =>
    setForm({
      name: "",
      category: ASSET_CATEGORIES[0],
      purchaseDate: "2026-09-27",
      cost: "",
      vendor: "",
      serialNumber: "",
      assignedTo: "—",
      warrantyExpiry: "",
      status: "Active",
      invoice: "",
      notes: "",
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ tone: "danger", title: "Asset name required", message: "Enter the asset name to continue." });
      return;
    }
    addAsset({
      id: `A-${Date.now()}`,
      assetId: nextAssetId,
      name: form.name.trim(),
      category: form.category,
      assignedTo: form.assignedTo,
      purchaseDate: form.purchaseDate,
      cost: Number(form.cost) || 0,
      vendor: form.vendor.trim() || "—",
      serialNumber: form.serialNumber.trim() || "—",
      warrantyExpiry: form.warrantyExpiry || "—",
      status: form.status,
      invoice: form.invoice || "—",
      notes: form.notes,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add Office Asset"
      subtitle={`${OFFICE.banner} — office asset register`}
      onClose={() => {
        reset();
        onClose();
      }}
      width={760}
      footer={
        <>
          <button
            className="of-btn of-btn-ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
          <button className="of-btn of-btn-primary" onClick={handleSubmit}>
            Save Asset
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="of-form">
        <div className="of-form-callout">
          Asset ID <strong>{nextAssetId}</strong> · assigned assets are tracked against an employee
        </div>
        <div className="of-form-grid">
          <div className="of-field of-field-full">
            <label>Asset Name</label>
            <input
              placeholder="MacBook Pro 14&quot;"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="of-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {ASSET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Purchase Date</label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
            />
          </div>
          <div className="of-field">
            <label>Purchase Cost (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="1,50,000"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />
          </div>
          <div className="of-field">
            <label>Vendor</label>
            <input
              list="of-asset-vendor-options"
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            />
            <datalist id="of-asset-vendor-options">
              {vendors.map((v) => (
                <option key={v.id} value={v.name} />
              ))}
            </datalist>
          </div>
          <div className="of-field">
            <label>Serial Number</label>
            <input
              value={form.serialNumber}
              onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
            />
          </div>
          <div className="of-field">
            <label>Assigned To</label>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="—">— Unassigned —</option>
              {STAFF.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Warranty Expiry</label>
            <input
              type="date"
              value={form.warrantyExpiry}
              onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })}
            />
          </div>
          <div className="of-field">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as OfficeAsset["status"] })}
            >
              {ASSET_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Invoice</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setForm({ ...form, invoice: e.target.files?.[0]?.name ?? "—" })}
            />
          </div>
          <div className="of-field of-field-full">
            <label>Notes</label>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        <SectionTitle>Asset Register Preview</SectionTitle>
        <div className="of-preview-strip">
          <div>
            <span>Asset ID</span>
            <strong>{nextAssetId}</strong>
          </div>
          <div>
            <span>Purchase Cost</span>
            <strong>₹{(Number(form.cost) || 0).toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{form.status}</strong>
          </div>
        </div>
      </form>
    </Modal>
  );
}
