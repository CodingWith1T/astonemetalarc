"use client";

import { useState } from "react";
import { useSiteFinance } from "@/app/admin/site-finance/_components/SiteFinanceContext";
import { EXPENSE_CATEGORIES, SiteExpenseItem } from "@/app/admin/_lib/site-finance-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const formatTooltip = (value: any) => [value !== undefined ? `$${value.toLocaleString()}` : "$0", "USD"];

const renderPieLabel = (props: any) => `${props.category}: $${props.total.toLocaleString()}`;

export default function ReportsClient() {
  const { siteData, getAllExpenses } = useSiteFinance();
  const allExpenses: SiteExpenseItem[] = getAllExpenses(siteData.locationId);
  const [selectedMonth, setSelectedMonth] = useState("September 2026");

  const categoryData = Object.entries(EXPENSE_CATEGORIES).map(([category]) => {
    const total = allExpenses.filter((e) => e.category === category).reduce((sum, e) => sum + e.amount, 0);
    return { category, total };
  }).filter((d) => d.total > 0);

  const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];
  const currencySymbol = siteData.currencySymbol || "$";
  const reportingCurrencySymbol = siteData.reportingCurrencySymbol || "₹";

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2>Reports</h2>
        <p className="page-subtitle">{siteData.locationName} Site Finance — {selectedMonth}</p>
      </div>

      <div className="reports-grid">
        <section className="section-card summary-section">
          <h3>Monthly Summary</h3>
          <div className="monthly-summary">
            <div className="summary-row">
              <span className="label">Money Received</span>
              <span className="value positive">{currencySymbol}{siteData.summary.totalFundsSent.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="label">Total Expenses</span>
              <span className="value negative">{currencySymbol}{siteData.summary.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="summary-row highlight">
              <span className="label">Closing Balance</span>
              <span className="value balance">{currencySymbol}{siteData.summary.currentBalance.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="label">{reportingCurrencySymbol} Equivalent (Received)</span>
              <span className="value">{reportingCurrencySymbol}{siteData.summary.totalINRValue.toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row">
              <span className="label">Funding Transactions</span>
              <span className="value">{siteData.summary.transactionCount}</span>
            </div>
          </div>
        </section>

        <section className="section-card chart-section">
          <h3>Money In vs Money Out</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: "Received", value: siteData.summary.totalFundsSent },
                { name: "Expenses", value: siteData.summary.totalExpenses },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="section-card chart-section wide">
          <h3>Expense Category Breakdown</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="total"
                  nameKey="category"
                  label={renderPieLabel}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {categoryData.map((d, index) => (
                <div key={d.category} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span>{d.category}</span>
                  <span className="negative">{currencySymbol}{d.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-card transaction-section wide">
          <h3>Transaction Summary</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Funds Received</th>
                  <th>Rate</th>
                  <th>{siteData.reportingCurrency} Value</th>
                  <th>Prev. Balance</th>
                  <th>Available</th>
                  <th>Expenses</th>
                  <th>Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {siteData.transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td className="positive">{currencySymbol}{t.amountUSD.toLocaleString()}</td>
                    <td>{reportingCurrencySymbol}{t.exchangeRate}</td>
                    <td>{reportingCurrencySymbol}{t.inrValue.toLocaleString("en-IN")}</td>
                    <td>{currencySymbol}{t.previousBalance.toLocaleString()}</td>
                    <td className="available">{currencySymbol}{t.availableFunds.toLocaleString()}</td>
                    <td className="negative">{currencySymbol}{t.expenses.toLocaleString()}</td>
                    <td className="balance">{currencySymbol}{t.closingBalance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section-card expense-detail-section wide">
          <h3>Expense Details by Category</h3>
          {Object.entries(EXPENSE_CATEGORIES).map(([category, subcategories]) => {
            const catExpenses = allExpenses.filter((e) => e.category === category);
            const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
            if (catTotal === 0) return null;

            return (
              <div key={category} className="category-detail">
                <h4>{category} — {currencySymbol}{catTotal.toLocaleString()}</h4>
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Subcategory</th>
                      <th>Description</th>
                      <th>Project</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catExpenses.map((e) => (
                      <tr key={e.id}>
                        <td>{e.date}</td>
                        <td>{e.subcategory}</td>
                        <td>{e.description}</td>
                        <td>{e.project}</td>
                        <td className="negative">{currencySymbol}{e.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}