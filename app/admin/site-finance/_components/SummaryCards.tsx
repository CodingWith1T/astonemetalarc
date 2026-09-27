"use client";

import { useSiteFinance } from "./SiteFinanceContext";

export function SummaryCards() {
  const { siteData } = useSiteFinance();

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-label">Total Funds Sent</div>
        <div className="card-value positive">{siteData.currencySymbol}{siteData.summary.totalFundsSent.toLocaleString()}</div>
        <div className="card-sublabel">{siteData.reportingCurrencySymbol}{siteData.summary.totalINRValue.toLocaleString("en-IN")}</div>
      </div>
      <div className="summary-card">
        <div className="card-label">Total Expenses</div>
        <div className="card-value negative">{siteData.currencySymbol}{siteData.summary.totalExpenses.toLocaleString()}</div>
        <div className="card-sublabel">Based on entered items</div>
      </div>
      <div className="summary-card highlight">
        <div className="card-label">Current Balance</div>
        <div className="card-value balance">{siteData.currencySymbol}{siteData.summary.currentBalance.toLocaleString()}</div>
        <div className="card-sublabel">Closing balance</div>
      </div>
      <div className="summary-card">
        <div className="card-label">Funding Transactions</div>
        <div className="card-value">{siteData.summary.transactionCount}</div>
        <div className="card-sublabel">Total transactions</div>
      </div>
    </div>
  );
}