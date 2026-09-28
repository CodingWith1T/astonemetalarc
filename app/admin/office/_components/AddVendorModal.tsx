"use client";

import { useState, type FormEvent } from "react";
import { OFFICE, type OfficeVendor } from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import { Modal } from "@/app/admin/_lib/finance/ui";

const VENDOR_CATEGORIES = [
  "Rent & Property",
  "Internet & Telecom",
  "Stationery & Supplies",
  "Printing",
  "Maintenance & HVAC",
  "IT Hardware & Software",
  "Professional — Accounting",
  "Professional — Legal",
  "Security",
  "Transport",
];

export default function AddVendorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addVendor, toast } = useOffice();
  const [form, setForm] = useState({
    name: "",
    category: VENDOR_CATEGORIES[0],
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    paymentTerms: "Net 15",
    gstNumber: "",
  });

  const reset = () =>
    setForm({
      name: "",
      category: VENDOR_CATEGORIES[0],
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      paymentTerms: "Net 15",
      gstNumber: "",
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ tone: "danger", title: "Vendor name required", message: "Enter the vendor or supplier name." });
      return;
    }
    const vendor: OfficeVendor = {
      id: `VEN-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      contactPerson: form.contactPerson.trim() || "—",
      phone: form.phone.trim() || "—",
      email: form.email.trim() || "—",
      address: form.address.trim() || "—",
      paymentTerms: form.paymentTerms,
      gstNumber: form.gstNumber.trim() || "—",
      status: "Active",
      transactions: [],
    };
    addVendor(vendor);
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add Vendor"
      subtitle={`${OFFICE.banner} — office vendors and suppliers`}
      onClose={() => {
        reset();
        onClose();
      }}
      width={720}
      footer={
        <>
          <button
            className="fin-btn fin-btn-ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </button>
          <button className="fin-btn fin-btn-primary" onClick={handleSubmit}>
            Save Vendor
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="fin-form">
        <div className="fin-form-grid">
          <div className="fin-field fin-field-full">
            <label>Vendor Name</label>
            <input
              placeholder="ABC Properties"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="fin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="fin-field">
            <label>Contact Person</label>
            <input
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            />
          </div>
          <div className="fin-field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="fin-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="fin-field">
            <label>Payment Terms</label>
            <input
              value={form.paymentTerms}
              onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
            />
          </div>
          <div className="fin-field">
            <label>GST Number</label>
            <input
              value={form.gstNumber}
              onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            />
          </div>
          <div className="fin-field fin-field-full">
            <label>Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
