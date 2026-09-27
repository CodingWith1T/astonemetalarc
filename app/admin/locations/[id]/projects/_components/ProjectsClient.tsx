"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/src/lib/auth";
import {
  initialLocations,
  formatCurrency,
  downloadCSV,
} from "@/app/admin/_lib/locations-data";

export default function ProjectsClient() {
  const { isAuthenticated } = useRequireAuth("/admin/login");
  const params = useParams();
  const router = useRouter();
  const locationId = params?.id as string;

  const location = initialLocations.find((loc) => loc.id === locationId);

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

  const totalReceived = location.projects.reduce(
    (sum, p) => sum + p.received,
    0
  );
  const totalExpenses = location.projects.reduce(
    (sum, p) => sum + p.expenses,
    0
  );
  const totalBalance = totalReceived - totalExpenses;

  const handleDownload = () => {
    const headers = ["Project", "Received", "Expenses", "Balance"];
    const rows = location.projects.map((project) => {
      const balance = project.received - project.expenses;
      return [
        project.name,
        formatCurrency(project.received, project.currency),
        formatCurrency(project.expenses, project.currency),
        formatCurrency(balance, project.currency),
      ];
    });
    downloadCSV(`${location.name}-projects.csv`, headers, rows);
  };

  return (
    <>
      <Link href="/admin/locations" className="admin-back-link">
        ← Locations / {location.name}
      </Link>

      <div className="admin-funds-header">
        <h1>Projects ({location.projects.length})</h1>
        <button className="admin-btn" onClick={handleDownload}>
          Download CSV
        </button>
      </div>

      <div className="admin-report-summary">
        <div className="admin-report-item">
          <div className="stat-value">
            {formatCurrency(totalReceived, location.currency)}
          </div>
          <div className="stat-label">Total Received</div>
        </div>
        <div className="admin-report-item">
          <div className="stat-value">
            {formatCurrency(totalExpenses, location.currency)}
          </div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="admin-report-item">
          <div
            className="stat-value"
            style={{ color: totalBalance >= 0 ? "#38a169" : "#e53e3e" }}
          >
            {formatCurrency(totalBalance, location.currency)}
          </div>
          <div className="stat-label">Net Balance</div>
        </div>
      </div>

      <div className="admin-projects-grid">
        {location.projects.map((project) => {
          const projBalance = project.received - project.expenses;
          const projBalanceClass =
            projBalance >= 0
              ? "admin-balance-positive"
              : "admin-balance-negative";

          return (
            <div key={project.id} className="admin-project-card">
              <div className="project-name">{project.name}</div>
              {project.description && (
                <div className="project-description">
                  {project.description}
                </div>
              )}

              <div className="admin-project-finances">
                <div className="admin-project-finance-item">
                  <div className="finance-label">Funds</div>
                  <div className="finance-value">
                    {formatCurrency(project.received, project.currency)}
                  </div>
                </div>
                <div className="admin-project-finance-item">
                  <div className="finance-label">Expenses</div>
                  <div className="finance-value">
                    {formatCurrency(project.expenses, project.currency)}
                  </div>
                </div>
                <div className="admin-project-finance-item">
                  <div className="finance-label">Balance</div>
                  <div className={`finance-value ${projBalanceClass}`}>
                    {formatCurrency(projBalance, project.currency)}
                  </div>
                </div>
              </div>

              <div className="admin-project-actions">
                <Link
                  href={`/admin/locations/${locationId}/projects/${project.id}`}
                  className="admin-btn"
                >
                  View Project
                </Link>
                {project.expenseItems && project.expenseItems.length > 0 && (
                  <span className="admin-location-count">
                    {project.expenseItems.length} expenses
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
