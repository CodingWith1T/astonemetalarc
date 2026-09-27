"use client";

import { useSiteFinance } from "./SiteFinanceContext";
import { downloadCSV } from "@/app/admin/_lib/locations-data";
import { useRouter } from "next/navigation";

interface Tab {
  id: string;
  label: string;
  href: string;
}

interface SiteFinanceHeaderProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  router: ReturnType<typeof useRouter>;
  showAddFunds: boolean;
  setShowAddFunds: (v: boolean) => void;
  showAddExpense: boolean;
  setShowAddExpense: (v: boolean) => void;
}

export function SiteFinanceHeader({
  tabs,
  activeTab,
  setActiveTab,
  router,
  showAddFunds,
  setShowAddFunds,
  showAddExpense,
  setShowAddExpense,
}: SiteFinanceHeaderProps) {
  const { siteData, selectedLocationId, setSelectedLocationId, selectedLocation, locations } = useSiteFinance();

  const handleExport = () => {
    const headers = [
      "Date",
      `Amount ${siteData.currency}`,
      "Rate",
      `${siteData.reportingCurrency} Value`,
      "Previous Balance",
      "Available Funds",
      "Expenses",
      "Closing Balance",
    ];
    const rows = siteData.transactions.map((t) => [
      t.date,
      `${siteData.currencySymbol}${t.amountUSD.toLocaleString()}`,
      `${siteData.reportingCurrencySymbol}${t.exchangeRate}`,
      `${siteData.reportingCurrencySymbol}${t.inrValue.toLocaleString("en-IN")}`,
      `${siteData.currencySymbol}${t.previousBalance.toLocaleString()}`,
      `${siteData.currencySymbol}${t.availableFunds.toLocaleString()}`,
      `${siteData.currencySymbol}${t.expenses.toLocaleString()}`,
      `${siteData.currencySymbol}${t.closingBalance.toLocaleString()}`,
    ]);
    downloadCSV(`${siteData.locationId}-site-finance.csv`, headers, rows);
  };

  return (
    <header className="site-finance-header">
      <div className="header-left">
        <div className="location-selector">
          <label htmlFor="site-location">Site Location</label>
          <select
            id="site-location"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="location-select"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.country})
              </option>
            ))}
          </select>
        </div>
        <h1>{siteData.locationName} — Site Finance</h1>
        <div className="site-finance-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                router.push(tab.href);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="header-right">
        <div className="currency-info">
          <span className="currency-badge">{siteData.currency} / {siteData.reportingCurrency}</span>
          {selectedLocation && (
            <span className="rate-badge">Rate: {siteData.reportingCurrencySymbol}{siteData.exchangeRate}/{siteData.currency}</span>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddFunds(true)}>
          + Add Funds
        </button>
        <button className="btn btn-secondary" onClick={() => setShowAddExpense(true)}>
          + Add Expense
        </button>
        <button className="btn btn-outline" onClick={handleExport}>
          Export Report
        </button>
      </div>
    </header>
  );
}