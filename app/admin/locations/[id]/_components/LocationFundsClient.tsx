"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/src/lib/auth";
import {
  LocationData,
  getStoredLocations,
  saveLocations,
  formatCurrency,
  FundTransaction,
} from "@/app/admin/_lib/locations-data";

export default function LocationFundsClient() {
  const { isAuthenticated } = useRequireAuth("/admin/login");
  const params = useParams();
  const router = useRouter();

  const locationId = params?.id as string;

  const [location, setLocation] = useState<LocationData | null>(() => {
    const stored = getStoredLocations();
    return stored.find((loc) => loc.id === locationId) || null;
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    method: "Bank",
    reference: "",
  });

  if (!isAuthenticated) {
    return (
      <div className="admin-redirect-msg">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (!location) {
    router.replace("/admin/locations");
    return (
      <div className="admin-redirect-msg">
        <p>Location not found. Redirecting...</p>
      </div>
    );
  }

  const totalFunds = location.funds.reduce((sum, f) => sum + f.amount, 0);

  const handleAddFund = () => {
    if (!formData.date || !formData.amount || !formData.reference) return;

    const newFund: FundTransaction = {
      id: `f-${Date.now()}`,
      date: formData.date,
      amount: parseFloat(formData.amount),
      method: formData.method,
      reference: formData.reference,
    };

    const stored = getStoredLocations();
    const locIndex = stored.findIndex((l) => l.id === locationId);
    if (locIndex >= 0) {
      const updated = [...stored];
      updated[locIndex] = {
        ...updated[locIndex],
        funds: [newFund, ...updated[locIndex].funds],
      };
      saveLocations(updated);
      setLocation(updated[locIndex]);
    }

    setFormData({ date: "", amount: "", method: "Bank", reference: "" });
    setShowForm(false);
  };

  return (
    <>
      <Link href="/admin/locations" className="admin-back-link">
        ← Locations / {location.name}
      </Link>

      <div className="admin-funds-header">
        <h1>{location.name} / Funds</h1>
        <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
          + Add Funds
        </button>
      </div>

      {showForm && (
        <div className="admin-add-funds-form">
          <h3>Add Funds</h3>
          <div className="admin-add-funds-row">
            <input
              type="date"
              className="admin-input"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              type="number"
              className="admin-input"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
            <select
              className="admin-input"
              value={formData.method}
              onChange={(e) =>
                setFormData({ ...formData, method: e.target.value })
              }
            >
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
            <input
              type="text"
              className="admin-input"
              placeholder="Reference"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
            />
          </div>
          <div className="admin-add-location-actions">
            <button
              className="admin-btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button className="admin-btn" onClick={handleAddFund}>
              Add Fund
            </button>
          </div>
        </div>
      )}

      <div className="admin-funds-total">
        <div className="total-label">Total Funds Received</div>
        <div className="total-amount">
          {formatCurrency(totalFunds, location.currency)}
        </div>
      </div>

      <div className="admin-funding-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {location.funds.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-locations-empty">
                  No funds added yet. Click &lsquo;+ Add Funds&rsquo; to get started.
                </td>
              </tr>
            ) : (
              location.funds.map((fund) => (
                <tr key={fund.id}>
                  <td>{fund.date}</td>
                  <td className="admin-amount-received">
                    {formatCurrency(fund.amount, location.currency)}
                  </td>
                  <td>{fund.method}</td>
                  <td>{fund.reference}</td>
                </tr>
              ))
            )}
            <tr className="admin-funding-total-row">
              <td>TOTAL</td>
              <td className="admin-amount-received">
                {formatCurrency(totalFunds, location.currency)}
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
