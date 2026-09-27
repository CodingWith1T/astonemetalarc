"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/src/lib/auth";
import {
  LocationData,
  Project,
  initialLocations,
  formatCurrency,
} from "@/app/admin/_lib/locations-data";

export default function ProjectDetailsClient() {
  const { isAuthenticated } = useRequireAuth("/admin/login");
  const params = useParams();
  const router = useRouter();

  const locationId = params?.id as string;
  const projectId = params?.projectId as string;

  const [location] = useState<LocationData | null>(() =>
    initialLocations.find((loc) => loc.id === locationId) || null
  );

  const [project] = useState<Project | null>(() => {
    const loc = initialLocations.find((l) => l.id === locationId);
    if (!loc) return null;
    return loc.projects.find((p) => p.id === projectId) || null;
  });

  if (!isAuthenticated) {
    return (
      <div className="admin-redirect-msg">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (!location || !project) {
    router.replace("/admin/locations");
    return (
      <div className="admin-redirect-msg">
        <p>Project not found. Redirecting...</p>
      </div>
    );
  }

  const balance = project.received - project.expenses;
  const balanceClass =
    balance >= 0 ? "admin-balance-positive" : "admin-balance-negative";

  const expenseItems = project.expenseItems || [];
  const totalExpenses = expenseItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const expenseCategories = [
    { name: "Salaries", color: "#f50" },
    { name: "Materials", color: "#0e2f3e" },
    { name: "Utilities", color: "#2b6cb0" },
    { name: "Transport", color: "#38a169" },
  ];

  return (
    <>
      <Link href={`/admin/locations/${locationId}`} className="admin-back-link">
        ← Locations / {location.name}
      </Link>

      <div className="admin-project-details-header">
        <h1>{project.name}</h1>
        <div className="country">{project.description}</div>
      </div>

      <div className="admin-project-summary">
        <div className="admin-overview-card">
          <div className="stat-value">
            {formatCurrency(project.received, project.currency)}
          </div>
          <div className="stat-label">Money Received</div>
        </div>
        <div className="admin-overview-card">
          <div className="stat-value">
            {formatCurrency(project.expenses, project.currency)}
          </div>
          <div className="stat-label">Expenses</div>
        </div>
        <div className="admin-overview-card">
          <div className={`stat-value ${balanceClass}`}>
            {formatCurrency(balance, project.currency)}
          </div>
          <div className="stat-label">Balance</div>
        </div>
      </div>

      <div className="admin-expense-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th className="admin-amount-received" style={{ textAlign: "right" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="admin-locations-empty">
                  No expense items recorded yet.
                </td>
              </tr>
            ) : (
              expenseItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td className="admin-expense-category">
                    {item.category}
                  </td>
                  <td className="admin-expense-amount">
                    {formatCurrency(item.amount, item.currency)}
                  </td>
                </tr>
              ))
            )}
            <tr className="admin-expense-total-row">
              <td>TOTAL</td>
              <td></td>
              <td className="admin-expense-amount">
                {formatCurrency(totalExpenses, project.currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="admin-expense-legend">
        {expenseCategories.map((cat) => (
          <span key={cat.name} className="admin-legend-item">
            <span
              className="admin-legend-dot"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </span>
        ))}
      </div>
    </>
  );
}
