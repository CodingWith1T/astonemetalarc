"use client";

import { useState, type FormEvent } from "react";
import {
  DEPARTMENTS,
  OFFICE,
  REQUEST_TYPES,
  STAFF,
  type Department,
  type OfficeRequest,
} from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import { Modal, SectionTitle } from "./ui";

export default function AddRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addRequest, requests, toast } = useOffice();
  const [form, setForm] = useState({
    requestedBy: "Admin Executive",
    department: "Administration" as Department,
    requestType: "Purchase" as OfficeRequest["requestType"],
    item: "",
    quantity: "1",
    estimatedAmount: "",
    reason: "",
    priority: "Normal" as OfficeRequest["priority"],
    attachment: "",
  });

  const nextId = `REQ-${String(
    requests.reduce((m, r) => Math.max(m, Number(r.id.replace("REQ-", "")) || 0), 20) + 1
  ).padStart(3, "0")}`;

  const reset = () =>
    setForm({
      requestedBy: "Admin Executive",
      department: "Administration",
      requestType: "Purchase",
      item: "",
      quantity: "1",
      estimatedAmount: "",
      reason: "",
      priority: "Normal",
      attachment: "",
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.item.trim()) {
      toast({ tone: "danger", title: "Item required", message: "Describe the item or purpose of the request." });
      return;
    }
    addRequest({
      id: nextId,
      date: "2026-09-27",
      requestedBy: form.requestedBy,
      department: form.department,
      requestType: form.requestType,
      item: form.item.trim(),
      quantity: Number(form.quantity) || 1,
      estimatedAmount: Number(form.estimatedAmount) || 0,
      reason: form.reason.trim(),
      priority: form.priority,
      status: "Pending Approval",
      attachment: form.attachment,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Office Request"
      subtitle={`${OFFICE.banner} — purchase, reimbursement, advance and maintenance requests`}
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
            Submit Request
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="of-form">
        <div className="of-form-callout">
          Reference <strong>{nextId}</strong> · route: Submitted → Pending Approval → Approved
        </div>
        <div className="of-form-grid">
          <div className="of-field">
            <label>Requested By</label>
            <select value={form.requestedBy} onChange={(e) => setForm({ ...form, requestedBy: e.target.value })}>
              {STAFF.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value as Department })}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Request Type</label>
            <select
              value={form.requestType}
              onChange={(e) =>
                setForm({ ...form, requestType: e.target.value as OfficeRequest["requestType"] })
              }
            >
              {REQUEST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field">
            <label>Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as OfficeRequest["priority"] })}
            >
              {(["Low", "Normal", "High", "Urgent"] as const).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="of-field of-field-full">
            <label>Item</label>
            <input
              placeholder="Office Chairs (4 nos)"
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
            />
          </div>
          <div className="of-field">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div className="of-field">
            <label>Estimated Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="24,000"
              value={form.estimatedAmount}
              onChange={(e) => setForm({ ...form, estimatedAmount: e.target.value })}
            />
          </div>
          <div className="of-field of-field-full">
            <label>Reason</label>
            <textarea
              rows={2}
              placeholder="Why is this required?"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>
          <div className="of-field of-field-full">
            <label>Attachment</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png,.xlsx"
              onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0]?.name ?? "" })}
            />
            {form.attachment && <small className="of-hint">{form.attachment}</small>}
          </div>
        </div>

        <SectionTitle>Approval Route</SectionTitle>
        <ol className="of-flow-inline">
          <li>Submitted</li>
          <li>Pending Approval</li>
          <li>Approved</li>
          <li>Purchased / Completed</li>
        </ol>
      </form>
    </Modal>
  );
}
