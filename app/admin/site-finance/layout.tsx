"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFinanceProvider, useSiteFinance } from "./_lib/SiteFinanceContext";
import { SiteFinanceShell } from "./_components/SiteFinanceShell";
import { IconLocation } from "@/app/admin/_lib/finance/ui";
import { formatINR, formatMoney } from "@/app/admin/_lib/finance/format";

const NAV = [
  { label: "Overview", href: "/admin/site-finance" },
  { label: "Remittances", href: "/admin/site-finance/site-funds" },
  { label: "Site Expenses", href: "/admin/site-finance/expenses" },
  { label: "Balance Ledger", href: "/admin/site-finance/balance-ledger" },
  { label: "Reports", href: "/admin/site-finance/reports" },
];

function SiteSwitcher() {
  const { sites, selectedSiteId, setSelectedSiteId, site, totals } = useSiteFinance();

  return (
    <div className="fin-site-switcher">
      <div className="fin-site-switcher-label">
        <IconLocation size={14} />
        <span>Active Site</span>
      </div>
      <div className="fin-site-tabs" role="tablist" aria-label="Select site">
        {sites.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={s.id === selectedSiteId}
            className={`fin-site-tab${s.id === selectedSiteId ? " active" : ""}`}
            onClick={() => setSelectedSiteId(s.id)}
          >
            <span className="fin-site-tab-name">{s.name}</span>
            <span className="fin-site-tab-meta">
              {s.country} · {s.currency}
            </span>
          </button>
        ))}
      </div>
      <div className="fin-site-switcher-right">
        <span className="fin-site-code">{site.projectCode}</span>
        <span className="fin-site-balance">
          Site Balance ·{" "}
          <strong>{formatMoney(totals.closingBalance, totals.currency)}</strong>
        </span>
      </div>
    </div>
  );
}

function SiteStrip() {
  const { site, totals, period } = useSiteFinance();
  const inrNote =
    site.currency === "USD"
      ? `₹${formatINR(totals.closingBalance * site.exchangeRate).replace("₹", "")} @ ₹${site.exchangeRate}/$`
      : "Reporting currency — Indian Rupee";

  return (
    <div className="fin-office-strip">
      <div className="fin-office-strip-left">
        <span className="fin-office-pin">
          <IconLocation size={14} />
        </span>
        <span className="fin-office-banner">
          {site.name} · {site.clientName}
        </span>
        <span className="fin-office-currency">
          Site currency · {site.currency === "INR" ? "Indian Rupee (₹)" : "US Dollar ($)"}
        </span>
      </div>
      <div className="fin-office-strip-right">
        <span className="fin-single-office-tag" title={inrNote}>
          {site.currency === "USD" ? `Group INR @ ₹${site.exchangeRate}/$` : "Group reporting · INR"}
        </span>
        <span className="fin-month-tag">{period.label}</span>
      </div>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SiteFinanceShell>
      <div className="fin-shell">
        <SiteStrip />
        <SiteSwitcher />

        <nav className="fin-subnav">
          {NAV.map((item) => {
            const active =
              item.href === "/admin/site-finance"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`fin-subnav-link${active ? " active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="fin-main">{children}</main>
      </div>
    </SiteFinanceShell>
  );
}

export default function SiteFinanceLayout({ children }: { children: ReactNode }) {
  return (
    <SiteFinanceProvider>
      <Shell>{children}</Shell>
    </SiteFinanceProvider>
  );
}
