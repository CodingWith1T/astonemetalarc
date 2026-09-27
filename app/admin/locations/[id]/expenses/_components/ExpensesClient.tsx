"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/src/lib/auth";
import {
  LocationData,
  initialLocations,
  formatCurrency,
  downloadCSV,
} from "@/app/admin/_lib/locations-data";

const expenseCategories = [
  "All",
  "Salaries",
  "Materials",
  "Transport",
  "Utilities",
];

export default function ExpensesClient() {
  const { isAuthenticated } = useRequireAuth("/admin/login");
  const params = useParams();
  const router = useRouter();
  const locationId = params?.id as string;

  const [location] = useState<LocationData | null>(() =>
    initialLocations.find((loc) => loc.id === locationId) || null
  );
  const [activeFilter, setActiveFilter] = useState("All");

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

  const allExpenseItems = location.projects.flatMap((project) =>
    (project.expenseItems || []).map((item) => ({
      ...item,
      projectName: project.name,
    }))
  );

  const filtered =
    activeFilter === "All"
      ? allExpenseItems
      : allExpenseItems.filter((item) => {
          const lowerCategory = item.category.toLowerCase();
          const lowerFilter = activeFilter.toLowerCase();
          if (lowerFilter === "salaries")
            return lowerCategory.includes("salary");
          if (lowerFilter === "transport")
            return lowerCategory.includes("petrol") || lowerCategory.includes("transport");
          if (lowerFilter === "utilities")
            return lowerCategory.includes("sim");
          if (lowerFilter === "materials")
            return (
              lowerCategory.includes("steel") ||
              lowerCategory.includes("cement") ||
              lowerCategory.includes("electrical") ||
              lowerCategory.includes("plumbing") ||
              lowerCategory.includes("roofing") ||
              lowerCategory.includes("foundation") ||
              lowerCategory.includes("doors") ||
              lowerCategory.includes("structure")
            );
          return true;
        });

  const totalExpenses = filtered.reduce((sum, item) => sum + item.amount, 0);

  const handleDownload = () => {
    const headers = ["Date", "Project", "Category", "Amount"];
    const rows = filtered.map((item) => [
      item.date,
      item.projectName,
      item.category,
      formatCurrency(item.amount, location.currency),
    ]);
    downloadCSV(
      `${location.name}-expenses.csv`,
      headers,
      rows
    );
  };

  return (
    <>
      <Link href="/admin/locations" className="admin-back-link">
        ← Locations / {location.name}
      </Link>

      <div className="admin-funds-header">
        <h1>Expenses</h1>
        <button className="admin-btn" onClick={handleDownload}>
          Download CSV
        </button>
      </div>

      <div className="admin-expense-filters">
        {expenseCategories.map((cat) => (
          <button
            key={cat}
            className={`admin-filter-chip${activeFilter === cat ? " active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="admin-locations-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Category</th>
              <th className="admin-amount-received" style={{ textAlign: "right" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-locations-empty">
                  No expense items found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.projectName}</td>
                  <td className="admin-expense-category">{item.category}</td>
                  <td className="admin-expense-amount" style={{ textAlign: "right" }}>
                    {formatCurrency(item.amount, item.currency)}
                  </td>
                </tr>
              ))
            )}
            <tr className="admin-funding-total-row">
              <td>TOTAL</td>
              <td></td>
              <td></td>
              <td className="admin-expense-amount" style={{ textAlign: "right" }}>
                {formatCurrency(totalExpenses, location.currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
