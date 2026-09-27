"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRequireAuth } from "@/src/lib/auth";
import {
  initialLocations,
  formatCurrency,
  downloadCSV,
} from "@/app/admin/_lib/locations-data";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartTooltip = {
  contentStyle: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    color: "#fff",
  },
  itemStyle: { color: "#fff" },
  padding: "6px 10px",
};

export default function ReportsClient() {
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

  const totalReceived = location.received;
  const totalExpenses = location.projects.reduce(
    (sum, p) => sum + p.expenses,
    0
  );
  const totalBalance = totalReceived - totalExpenses;

  const pieData = location.projects.map((project) => ({
    name: project.name,
    value: project.expenses,
  }));

  const pieColors = ["#f50", "#0e2f3e", "#2b6cb0", "#38a169", "#805ad5"];

  const barData = location.projects.map((project) => ({
    name: project.name,
    received: project.received,
    expenses: project.expenses,
  }));

  const handleDownload = () => {
    const headers = ["Metric", "Amount"];
    const currency = location.currency;
    const rows = [
      ["Total Received", formatCurrency(totalReceived, currency)],
      ["Total Expenses", formatCurrency(totalExpenses, currency)],
      ["Balance", formatCurrency(totalBalance, currency)],
    ];
    location.projects.forEach((project) => {
      rows.push([
        `${project.name} - Received`,
        formatCurrency(project.received, currency),
      ]);
      rows.push([
        `${project.name} - Expenses`,
        formatCurrency(project.expenses, currency),
      ]);
    });
    downloadCSV(`${location.name}-report.csv`, headers, rows);
  };

  return (
    <>
      <Link href="/admin/locations" className="admin-back-link">
        ← Locations / {location.name}
      </Link>

      <div className="admin-funds-header">
        <h1>Reports</h1>
        <button className="admin-btn" onClick={handleDownload}>
          Download CSV
        </button>
      </div>

      <div className="admin-report-section">
        <h3>Financial Summary</h3>
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
              style={{
                color: totalBalance >= 0 ? "#38a169" : "#e53e3e",
              }}
            >
              {formatCurrency(totalBalance, location.currency)}
            </div>
            <div className="stat-label">Balance</div>
          </div>
        </div>
      </div>

      <div className="admin-report-section">
        <h3>Expense Breakdown by Project</h3>
        <div className="admin-chart-row">
          <div className="admin-chart-card">
            <div className="admin-chart-canvas">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    paddingAngle={4}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltip.contentStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="admin-chart-card">
            <div className="admin-chart-canvas">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#d2d2d2"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8e8e8f", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8e8e8f", fontSize: 11 }}
                  />
                  <Tooltip contentStyle={chartTooltip.contentStyle} />
                  <Bar dataKey="received" fill="#f50" name="Received" />
                  <Bar dataKey="expenses" fill="#0e2f3e" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-report-section">
        <h3>Project Details</h3>
        <div className="admin-locations-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Received</th>
                <th>Expenses</th>
                <th>Balance</th>
                <th>Expense Items</th>
              </tr>
            </thead>
            <tbody>
              {location.projects.map((project) => {
                const balance = project.received - project.expenses;
                const balanceClass =
                  balance >= 0
                    ? "admin-balance-positive"
                    : "admin-balance-negative";
                const expenseCount = project.expenseItems?.length || 0;

                return (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.name}</strong>
                    </td>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
