"use client";

import { useRequireAuth } from "@/src/lib/auth";
import {
  ProjectStatusBarChart,
  CallStatusPieChart,
  RevenueLineChart,
  OutcomeCategoriesChart,
  StatCard,
} from "@/app/admin/_components/Charts";

export default function AdminDashboardPage() {
  const { isAuthenticated } = useRequireAuth("/admin/login");

  if (!isAuthenticated) {
    return (
      <div className="admin-redirect-msg">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="admin-dashboard-title">Dashboard</h1>

      <div className="admin-stat-cards">
        <StatCard value="44" label="Total Projects" />
        <StatCard value="28" label="Locations Served" />
        <StatCard value="32" label="Completed Projects" />
        <StatCard value="12" label="Ongoing Projects" />
      </div>

      <div className="admin-chart-row">
        <div className="admin-chart-card">
          <h3>Project Status</h3>
          <div className="admin-chart-canvas">
            <ProjectStatusBarChart />
          </div>
        </div>
        <div className="admin-chart-card">
          <h3>Call Status</h3>
          <div className="admin-chart-canvas">
            <CallStatusPieChart />
          </div>
        </div>
        <div className="admin-chart-card">
          <h3>Outcome Categories</h3>
          <div className="admin-chart-canvas">
            <OutcomeCategoriesChart />
          </div>
        </div>
      </div>

      <div className="admin-full-width-chart">
        <h3>Revenue Trend (Cr.)</h3>
        <div className="admin-chart-canvas">
          <RevenueLineChart />
        </div>
      </div>
    </>
  );
}
