"use client";

import Link from "next/link";
import { useRequireAuth } from "@/src/lib/auth";
import {
  initialLocations,
  formatCurrency,
  downloadCSV,
} from "@/app/admin/_lib/locations-data";

function getAllProjects() {
  return initialLocations.flatMap((loc) =>
    loc.projects.map((project) => ({
      ...project,
      locationId: loc.id,
      locationName: loc.name,
    }))
  );
}

function getProjectCurrencyTotals(projects: ReturnType<typeof getAllProjects>) {
  const totals: Record<string, { received: number; expenses: number }> = {};
  projects.forEach((p) => {
    if (!totals[p.currency]) {
      totals[p.currency] = { received: 0, expenses: 0 };
    }
    totals[p.currency].received += p.received;
    totals[p.currency].expenses += p.expenses;
  });
  return totals;
}

export default function AdminProjectsPage() {
  const { isAuthenticated } = useRequireAuth("/admin/login");
  const allProjects = getAllProjects();
  const currencyTotals = getProjectCurrencyTotals(allProjects);

  if (!isAuthenticated) {
    return (
      <div className="admin-redirect-msg">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const handleDownload = () => {
    const headers = ["Location", "Project", "Area", "Duration", "Received", "Expenses", "Balance"];
    const rows = allProjects.map((project) => {
      const balance = project.received - project.expenses;
      return [
        project.locationName,
        project.name,
        project.area || "-",
        project.duration || "-",
        formatCurrency(project.received, project.currency),
        formatCurrency(project.expenses, project.currency),
        formatCurrency(balance, project.currency),
      ];
    });
    downloadCSV("all-projects.csv", headers, rows);
  };

  const currencies = Object.keys(currencyTotals);

  return (
    <>
      <div className="admin-locations-header">
        <h1>Projects ({allProjects.length})</h1>
        <button className="admin-btn" onClick={handleDownload}>
          Download CSV
        </button>
      </div>

      <div className="admin-stat-cards">
        {currencies.map((currency) => {
          const totals = currencyTotals[currency];
          const balance = totals.received - totals.expenses;
          return (
            <>
              <div className="admin-stat-card">
                <div className="stat-value">
                  {formatCurrency(totals.received, currency)}
                </div>
                <div className="stat-label">Received ({currency})</div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-value">
                  {formatCurrency(totals.expenses, currency)}
                </div>
                <div className="stat-label">Expenses ({currency})</div>
              </div>
              <div className="admin-stat-card">
                <div
                  className="stat-value"
                  style={{ color: balance >= 0 ? "#38a169" : "#e53e3e" }}
                >
                  {formatCurrency(balance, currency)}
                </div>
                <div className="stat-label">Balance ({currency})</div>
              </div>
            </>
          );
        })}
      </div>

      <div className="admin-locations-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Project</th>
              <th>Area</th>
              <th>Duration</th>
              <th>Received</th>
              <th>Expenses</th>
              <th>Balance</th>
              <th>Expense Items</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.map((project) => {
              const balance = project.received - project.expenses;
              const balanceClass =
                balance >= 0
                  ? "admin-balance-positive"
                  : "admin-balance-negative";
              const expenseCount = project.expenseItems?.length || 0;

              return (
                <tr key={project.id}>
                  <td>{project.locationName}</td>
                  <td>
                    <strong>{project.name}</strong>
                  </td>
                  <td>{project.area || "-"}</td>
                  <td>{project.duration || "-"}</td>
                  <td className="admin-amount-received">
                    {formatCurrency(project.received, project.currency)}
                  </td>
                  <td className="admin-amount-expense">
                    {formatCurrency(project.expenses, project.currency)}
                  </td>
                  <td>
                    <span className={balanceClass}>
                      {formatCurrency(balance, project.currency)}
                    </span>
                  </td>
                  <td>
                    <span className="admin-location-count">
                      {expenseCount} items
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/locations/${project.locationId}/projects/${project.id}`}
                      className="admin-btn-secondary"
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        display: "inline-block",
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
            {currencies.map((currency) => {
              const totals = currencyTotals[currency];
              const balance = totals.received - totals.expenses;
              const balanceClass =
                balance >= 0
                  ? "admin-balance-positive"
                  : "admin-balance-negative";
              return (
                <tr key={currency} className="admin-funding-total-row">
                  <td>
                    <strong>Total ({currency})</strong>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="admin-amount-received">
                    <strong>{formatCurrency(totals.received, currency)}</strong>
                  </td>
                  <td className="admin-amount-expense">
                    <strong>{formatCurrency(totals.expenses, currency)}</strong>
                  </td>
                  <td>
                    <strong className={balanceClass}>
                      {formatCurrency(balance, currency)}
                    </strong>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
