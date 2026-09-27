"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/lib/auth";
import type { ReactNode } from "react";

const sidebarItems = [
  // { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Locations", path: "/admin/locations" },
  { label: "Projects", path: "/admin/projects" },
  {
    label: "Site Finance",
    path: "#",
    subItems: [
      { label: "Overview", path: "/admin/site-finance" },
      { label: "Site Funds", path: "/admin/site-finance/site-funds" },
      { label: "Expenses", path: "/admin/site-finance/expenses" },
      { label: "Balance Ledger", path: "/admin/site-finance/balance-ledger" },
      { label: "Reports", path: "/admin/site-finance/reports" },
    ],
  },
  { label: "Procurement", path: "/admin/procurement" },
  { label: "Labour", path: "/admin/labour" },
  { label: "Materials", path: "/admin/materials" },
  { label: "Office", path: "/admin/office" },
  { label: "HR", path: "/admin/hr" },
  { label: "Telecaller", path: "/admin/telecaller" },
];

const footerItems = [
  { label: "Users & Roles", path: "/admin/users" },
  { label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openFinance, setOpenFinance] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="admin-main">{children}</div>;
  }

  const financeActive = pathname.startsWith("/admin/site-finance");
  const financeOpen = openFinance || financeActive;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="logo">ASTONE METAL ARC</div>
        </div>

        <div className="admin-sidebar-title">
          <a href="/admin/dashboard">
            Dashboard</a>
        </div>

        <ul className="admin-sidebar-nav">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            const hasSubItems = !!item.subItems;
            const isOpen = item.label === "Site Finance" && financeOpen;

            return (
              <li key={item.label}>
                <a
                  href={item.path}
                  className={`admin-sidebar-link${isActive ? " active" : ""}`}
                  onClick={(e) => {
                    if (hasSubItems) {
                      e.preventDefault();
                      setOpenFinance(!openFinance);
                    }
                  }}
                >
                  {item.label}
                  {hasSubItems && (
                    <span className={`chevron${isOpen ? " open" : ""}`}>
                      ▼
                    </span>
                  )}
                </a>
                {hasSubItems && isOpen && (
                  <>
                    {item.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.path}
                        className={`admin-sidebar-subitem${pathname === sub.path ? " active" : ""
                          }`}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </>
                )}
              </li>
            );
          })}
        </ul>

        <div className="admin-sidebar-footer">
          {footerItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={`admin-sidebar-link${pathname === item.path ? " active" : ""
                }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#logout"
            className="admin-sidebar-link"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </a>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
