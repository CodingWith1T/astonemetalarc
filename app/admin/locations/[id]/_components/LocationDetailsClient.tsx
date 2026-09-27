"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useRequireAuth } from "@/src/lib/auth";
import {
  LocationData,
  initialLocations,
  formatCurrency,
} from "@/app/admin/_lib/locations-data";

const tabs = [
  { label: "Overview", path: "" },
  { label: "Funds", path: "/funds" },
  { label: "Expenses", path: "/expenses" },
  { label: "Projects", path: "/projects" },
  { label: "Reports", path: "/reports" },
];

export default function LocationDetailsClient() {
  const { isAuthenticated } = useRequireAuth("/admin/login");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const locationId = params?.id as string;

  const [location] = useState<LocationData | null>(() =>
    initialLocations.find((loc) => loc.id === locationId) || null
  );

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

  const currentTabPath = pathname.replace(`/admin/locations/${locationId}`, "");
  const activeTab =
    currentTabPath === ""
      ? "Overview"
      : tabs.find((t) => t.path === currentTabPath)?.label || "Overview";

  const balance = location.received - location.expenses;
  const balanceClass =
    balance >= 0 ? "admin-balance-positive" : "admin-balance-negative";

  return (
    <>
      <Link href="/admin/locations" className="admin-back-link">
        ← Locations
      </Link>

      <div className="admin-location-details-header">
        <h1>{location.name}</h1>
        <div className="country">{location.country}</div>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => {
          const href = `/admin/locations/${locationId}${tab.path}`;
          const isActive = activeTab === tab.label;
          return (
            <Link
              key={tab.label}
              href={href}
              className={`admin-tab${isActive ? " active" : ""}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {activeTab === "Overview" && (
        <div className="admin-tab-content">
          <div className="admin-overview-cards">
            <div className="admin-overview-card">
              <div className="stat-value">
                {formatCurrency(location.received, location.currency)}
              </div>
              <div className="stat-label">Money Received</div>
            </div>
            <div className="admin-overview-card">
              <div className="stat-value">
                {formatCurrency(location.expenses, location.currency)}
              </div>
              <div className="stat-label">Expenses</div>
            </div>
            <div className="admin-overview-card">
              <div className={`stat-value ${balanceClass}`}>
                {formatCurrency(balance, location.currency)}
              </div>
              <div className="stat-label">Balance</div>
            </div>
          </div>

          <h2>Project Summary ({location.projects.length})</h2>

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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
