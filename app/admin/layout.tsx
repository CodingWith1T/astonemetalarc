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
  // { label: "Procurement", path: "/admin/procurement" },
  // { label: "Labour", path: "/admin/labour" },
  // { label: "Materials", path: "/admin/materials" },
  { label: "Office", path: "/admin/office", subItems: [
    { label: "Overview", path: "/admin/office" },
    { label: "Funds", path: "/admin/office/funds" },
    { label: "Expenses", path: "/admin/office/expenses" },
    { label: "Petty Cash", path: "/admin/office/petty-cash" },
    { label: "Requests", path: "/admin/office/requests" },
    { label: "Approvals", path: "/admin/office/approvals" },
    { label: "Vendors", path: "/admin/office/vendors" },
    { label: "Assets", path: "/admin/office/assets" },
    { label: "Reports", path: "/admin/office/reports" },
  ] },
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
  const [openGroups, setOpenGroups] = useState<string[]>(["Office"]);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="admin-main">{children}</div>;
  }

  const isGroupOpen = (label: string, hasSubItems: boolean) => {
    if (!hasSubItems) return false;
    return openGroups.includes(label) || sidebarItems.some(
      (i) => i.label === label && i.subItems?.some((s) => s.path === pathname)
    );
  };

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
            const isActive = item.subItems
              ? item.subItems.some((s) => s.path === pathname)
              : pathname === item.path;
            const hasSubItems = !!item.subItems;
            const isOpen = isGroupOpen(item.label, hasSubItems);

            return (
              <li key={item.label}>
                <a
                  href={item.path}
                  className={`admin-sidebar-link${isActive ? " active" : ""}`}
                  onClick={(e) => {
                    if (hasSubItems) {
                      e.preventDefault();
                      setOpenGroups((prev) =>
                        prev.includes(item.label)
                          ? prev.filter((l) => l !== item.label)
                          : [...prev, item.label]
                      );
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
