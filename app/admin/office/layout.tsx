"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Office } from "./_lib/office-data";
import { OfficeProvider } from "./_lib/OfficeContext";
import { OfficeShell } from "./_components/OfficeShell";
import { IconLocation } from "./_components/ui";

const NAV = [
  { label: "Overview", href: "/admin/office" },
  { label: "Funds", href: "/admin/office/funds" },
  { label: "Expenses", href: "/admin/office/expenses" },
  { label: "Petty Cash", href: "/admin/office/petty-cash" },
  { label: "Requests", href: "/admin/office/requests" },
  { label: "Approvals", href: "/admin/office/approvals" },
  { label: "Vendors", href: "/admin/office/vendors" },
  { label: "Assets", href: "/admin/office/assets" },
  { label: "Reports", href: "/admin/office/reports" },
];

const SUB_NAV = [
  { label: "Balance Ledger", href: "/admin/office/balance-ledger" },
  { label: "Expense Breakdown", href: "/admin/office/expense-breakdown" },
  { label: "Department Expenses", href: "/admin/office/departments" },
];

export default function OfficeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <OfficeProvider>
      <OfficeShell>
        <div className="of-shell">
          <div className="of-office-strip">
            <div className="of-office-strip-left">
              <span className="of-office-pin">
                <IconLocation size={14} />
              </span>
              <span className="of-office-banner">{Office.banner}</span>
              <span className="of-office-currency">Currency · Indian Rupee (₹)</span>
            </div>
            <div className="of-office-strip-right">
              <span className="of-single-office-tag">Single office — no location selector</span>
              <span className="of-month-tag">{Office.month}</span>
            </div>
          </div>

          <nav className="of-subnav">
            {NAV.map((item) => {
              const active = item.href === "/admin/office" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`of-subnav-link${active ? " active" : ""}`}>
                  {item.label}
                </Link>
              );
            })}
            <span className="of-subnav-sep" />
            {SUB_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`of-subnav-link of-subnav-link-sub${pathname.startsWith(item.href) ? " active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <main className="of-main">{children}</main>
        </div>
      </OfficeShell>
    </OfficeProvider>
  );
}
