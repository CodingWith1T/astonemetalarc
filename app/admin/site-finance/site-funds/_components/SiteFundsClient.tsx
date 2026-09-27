"use client";

import { useState } from "react";
import { useSiteFinance } from "@/app/admin/site-finance/_components/SiteFinanceContext";
import { getExpensesByTransactionId } from "@/app/admin/_lib/site-finance-data";

export default function SiteFundsClient() {
  const { siteData } = useSiteFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const handleRowClick = (id: string) => {
    setSelectedTransaction(selectedTransaction === id ? null : id);
  };

  return (
    <div className="site-funds-page">
      <div className="page-header">
        <h2>Funds Received</h2>
        <p className="page-subtitle">Company funding transactions sent to {siteData.locationName} site</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount {siteData.currency}</th>
              <th>Rate</th>
              <th>{siteData.reportingCurrency} Value</th>
              <th>Previous Balance</th>
              <th>Available Funds</th>
              <th>Expenses</th>
              <th>Closing Balance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {siteData.transactions.map((t, index) => {
              const isExpanded = selectedTransaction === t.id;
              return (
                <>
                  <tr key={t.id} className={isExpanded ? "expanded" : ""} onClick={() => handleRowClick(t.id)}>
                    <td>{t.date}</td>
                    <td className="positive">{siteData.currencySymbol}{t.amountUSD.toLocaleString()}</td>
                    <td>{siteData.reportingCurrencySymbol}{t.exchangeRate}</td>
                    <td>{siteData.reportingCurrencySymbol}{t.inrValue.toLocaleString("en-IN")}</td>
                    <td>{siteData.currencySymbol}{t.previousBalance.toLocaleString()}</td>
                    <td className="available">{siteData.currencySymbol}{t.availableFunds.toLocaleString()}</td>
                    <td className="negative">{siteData.currencySymbol}{t.expenses.toLocaleString()}</td>
                    <td className="balance">{siteData.currencySymbol}{t.closingBalance.toLocaleString()}</td>
                    <td>
                      <span className="expand-indicator">{isExpanded ? "▲" : "▼"}</span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${t.id}-detail`} className="detail-row">
                      <td colSpan={9}>
                        <div className="transaction-detail">
                          <div className="detail-grid">
                            <div className="detail-section">
                              <h4>Funding Details</h4>
                              <div className="detail-item">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">{t.date}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Amount Sent</span>
                                <span className="detail-value positive">{siteData.currencySymbol}{t.amountUSD.toLocaleString()}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Exchange Rate</span>
                                <span className="detail-value">{siteData.reportingCurrencySymbol}{t.exchangeRate} / {siteData.currency}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">{siteData.reportingCurrency} Equivalent</span>
                                <span className="detail-value">{siteData.reportingCurrencySymbol}{t.inrValue.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Payment Method</span>
                                <span className="detail-value">{t.paymentMethod}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Sent By</span>
                                <span className="detail-value">{t.sentBy}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Reference</span>
                                <span className="detail-value">{t.reference}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Notes</span>
                                <span className="detail-value">{t.notes}</span>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Balance Calculation</h4>
                              <div className="calculation-step">
                                <span>New Funds Received</span>
                                <span className="positive">{siteData.currencySymbol}{t.amountUSD.toLocaleString()}</span>
                              </div>
                              <div className="calculation-step">
                                <span>Previous Balance</span>
                                <span>{siteData.currencySymbol}{t.previousBalance.toLocaleString()}</span>
                              </div>
                              <div className="calculation-step total">
                                <span>Available Funds</span>
                                <span className="available">{siteData.currencySymbol}{t.availableFunds.toLocaleString()}</span>
                              </div>
                              <div className="calculation-step">
                                <span>Expenses</span>
                                <span className="negative">{siteData.currencySymbol}{t.expenses.toLocaleString()}</span>
                              </div>
                              <div className="calculation-step total">
                                <span>Closing Balance</span>
                                <span className="balance">{siteData.currencySymbol}{t.closingBalance.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Expense Items</h4>
                              {(() => {
                                const expenses = getExpensesByTransactionId(siteData.locationId, t.id);
                                const enteredTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
                                const hasDiscrepancy = enteredTotal !== t.expenses;

                                return (
                                  <>
                                    <table className="expense-items-table">
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
                                        {expenses.map((e) => (
                                          <tr key={e.id}>
                                            <td>{e.category}</td>
                                            <td>{e.subcategory}</td>
                                            <td>{e.description}</td>
                                            <td>{e.project}</td>
                                            <td className="negative">{siteData.currencySymbol}{e.amount.toLocaleString()}</td>
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
                                            <td className="discrepancy-value warning">
                                              {siteData.currencySymbol}{t.expenses.toLocaleString()}
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                    {hasDiscrepancy && (
                                      <div className="discrepancy-warning">
                                        ⚠ Expense total does not match the stated transaction expense amount of{" "}
                                        {siteData.currencySymbol}{t.expenses.toLocaleString()}. Based on entered items:{' '}
                                        {siteData.currencySymbol}{enteredTotal.toLocaleString()}
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>

        <div className="table-note">
          <p>
            * Based on the individual expense items entered. Click a row to view complete transaction details.
          </p>
        </div>
      </div>
    </div>
  );
}