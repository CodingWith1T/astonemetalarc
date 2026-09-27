"use client";

import { useState } from "react";
import { useSiteFinance } from "./SiteFinanceContext";
import { getExpensesByTransactionId, formatCurrencyUSD, formatCurrencyINR } from "@/app/admin/_lib/site-finance-data";

export default function SiteFinanceOverviewClient() {
  const { siteData } = useSiteFinance();
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  const hasDiscrepancy = siteData.transactions.some((t) => {
    const expenses = getExpensesByTransactionId(siteData.locationId, t.id);
    const enteredTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
    return enteredTotal !== t.expenses;
  });

  const renderTransactionTimeline = () => {
    return siteData.transactions.map((transaction, index) => {
      const expenses = getExpensesByTransactionId(siteData.locationId, transaction.id);
      const enteredTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      const hasDiscrepancy = enteredTotal !== transaction.expenses;

      return (
        <div key={transaction.id} className="timeline-item">
          <div className="timeline-date">{transaction.date.toUpperCase()}</div>
          <div className="timeline-content">
            <div className="timeline-section">
              <div className="section-header">Company Sent</div>
              <div className="section-value positive">{siteData.currencySymbol}{transaction.amountUSD.toLocaleString()}</div>
              <div className="section-sub">{siteData.reportingCurrencySymbol}{transaction.inrValue.toLocaleString("en-IN")}</div>
              <div className="section-detail">Rate: {siteData.reportingCurrencySymbol}{transaction.exchangeRate}/{siteData.currency}</div>
            </div>

            {index > 0 && (
              <div className="timeline-section carried-forward">
                <div className="section-header">Previous Balance</div>
                <div className="section-value balance-carried">{siteData.currencySymbol}{transaction.previousBalance.toLocaleString()}</div>
                <div className="carried-label">↓ Balance Carried Forward</div>
              </div>
            )}

            {index > 0 && (
              <div className="timeline-section">
                <div className="section-header">Available Funds</div>
                <div className="section-value available">{siteData.currencySymbol}{transaction.availableFunds.toLocaleString()}</div>
                <div className="section-formula">
                  {siteData.currencySymbol}{transaction.amountUSD.toLocaleString()} + {siteData.currencySymbol}{transaction.previousBalance.toLocaleString()}
                </div>
              </div>
            )}

            <div className="timeline-section">
              <div className="section-header">Expenses</div>
              <div className="section-value negative">{siteData.currencySymbol}{transaction.expenses.toLocaleString()}</div>
              <button
                className="expand-btn"
                onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
              >
                {expandedTransaction === transaction.id ? "Hide Details" : "Show Details"}
              </button>
              {expandedTransaction === transaction.id && (
                <div className="expense-breakdown">
                  <table className="breakdown-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Description</th>
                        <th>Project</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td>{expense.category}</td>
                          <td>{expense.subcategory}</td>
                          <td>{expense.description}</td>
                          <td>{expense.project}</td>
                          <td className="negative">{siteData.currencySymbol}{expense.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td colSpan={4} className="total-label">
                          Total (Entered Items)
                        </td>
                        <td className="total-value negative">{siteData.currencySymbol}{enteredTotal.toLocaleString()}</td>
                      </tr>
                      {hasDiscrepancy && (
                        <tr className="discrepancy-row">
                          <td colSpan={4} className="discrepancy-label">
                            ⚠ Stated Transaction Expense
                          </td>
                          <td className="discrepancy-value warning">{siteData.currencySymbol}{transaction.expenses.toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {hasDiscrepancy && (
                    <div className="discrepancy-warning">
                      ⚠ Expense total does not match the stated transaction expense amount of{" "}
                      {siteData.currencySymbol}{transaction.expenses.toLocaleString()}.
                      <br />
                      Based on entered items: {siteData.currencySymbol}{enteredTotal.toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="timeline-section closing">
              <div className="section-header">Closing Balance</div>
              <div className="section-value closing-balance">
                {siteData.currencySymbol}{transaction.closingBalance.toLocaleString()}
              </div>
              <div className="section-formula">
                {siteData.currencySymbol}{transaction.availableFunds.toLocaleString()} − {siteData.currencySymbol}{transaction.expenses.toLocaleString()}
              </div>
            </div>
          </div>

          {index < siteData.transactions.length - 1 && (
            <div className="timeline-connector">
              <div className="connector-line"></div>
              <div className="connector-label">↓ Balance Carried Forward</div>
              <div className="connector-line"></div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="site-finance-overview">
      <div className="overview-grid">
        <div className="overview-main">
          <section className="section-card">
            <h2>Site Funding & Expense Timeline</h2>
            <div className="timeline">{renderTransactionTimeline()}</div>
          </section>

          {hasDiscrepancy && (
            <section className="section-card discrepancy-card">
              <h2>⚠ Discrepancy Alert</h2>
              <p>
                One or more transactions show a stated expense that differs from the individual
                expense items entered.
              </p>
              <div className="discrepancy-options">
                {siteData.transactions.map((t) => {
                  const expenses = getExpensesByTransactionId(siteData.locationId, t.id);
                  const enteredTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
                  if (enteredTotal === t.expenses) return null;
                  return (
                    <div key={t.id} className="option-card">
                      <h4>{t.date} — If Total = {siteData.currencySymbol}{enteredTotal.toLocaleString()}</h4>
                      <p>Closing Balance: {siteData.currencySymbol}{(t.availableFunds - enteredTotal).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="overview-sidebar">
          <section className="section-card">
            <h2>Quick Summary</h2>
            <div className="quick-stats">
              <div className="stat-row">
                <span>Money Received</span>
                <span className="positive">{siteData.currencySymbol}{siteData.summary.totalFundsSent.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span>Total Expenses</span>
                <span className="negative">{siteData.currencySymbol}{siteData.summary.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="stat-row highlight">
                <span>Closing Balance</span>
                <span className="balance">{siteData.currencySymbol}{siteData.summary.currentBalance.toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="section-card">
            <h2>Funding Transactions</h2>
            <table className="funding-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>{siteData.currency}</th>
                  <th>{siteData.reportingCurrency}</th>
                  <th>Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {siteData.transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td className="positive">{siteData.currencySymbol}{t.amountUSD.toLocaleString()}</td>
                    <td>{siteData.reportingCurrencySymbol}{t.inrValue.toLocaleString("en-IN")}</td>
                    <td className="balance">{siteData.currencySymbol}{t.closingBalance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="section-card">
            <h2>Expense Categories (Total)</h2>
            <div className="category-summary">
              {["Labour", "Materials", "Site Operations", "Food / Daily Requirements", "Staff / Miscellaneous"].map(
                (cat) => {
                  const total = siteData.transactions
                    .flatMap((tx) => tx.expenseItems || [])
                    .filter((e) => e.category === cat)
                    .reduce((sum, e) => sum + e.amount, 0);
                  return (
                    <div key={cat} className="cat-row">
                      <span>{cat}</span>
                      <span className="negative">{siteData.currencySymbol}{total.toLocaleString()}</span>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}