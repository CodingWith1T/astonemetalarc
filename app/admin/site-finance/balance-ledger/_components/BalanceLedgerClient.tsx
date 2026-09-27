"use client";

import { useSiteFinance } from "@/app/admin/site-finance/_components/SiteFinanceContext";
import { getExpensesByTransactionId } from "@/app/admin/_lib/site-finance-data";

export default function BalanceLedgerClient() {
  const { siteData } = useSiteFinance();

  const ledgerEntries = siteData.transactions.flatMap((transaction, index) => {
    const entries = [
      {
        date: transaction.date,
        type: "Company Funding",
        description: `Site funding - ${transaction.reference}`,
        moneyIn: transaction.amountUSD,
        moneyOut: 0,
        balance: transaction.availableFunds,
        reference: transaction.reference,
      },
    ];

    const expenses = getExpensesByTransactionId(siteData.locationId, transaction.id);
    let runningBalance = transaction.availableFunds;

    expenses.forEach((expense) => {
      runningBalance -= expense.amount;
      entries.push({
        date: expense.date,
        type: "Expense",
        description: `${expense.category} - ${expense.subcategory}: ${expense.description}`,
        moneyIn: 0,
        moneyOut: expense.amount,
        balance: runningBalance,
        reference: expense.id,
      });
    });

    return entries;
  });

  const totalMoneyIn = siteData.transactions.reduce((sum, t) => sum + t.amountUSD, 0);
  const totalMoneyOut = siteData.transactions.reduce((sum, t) => sum + t.expenses, 0);
  const currentBalance = siteData.transactions[siteData.transactions.length - 1]?.closingBalance || 0;
  const currencySymbol = siteData.currencySymbol || "$";

  return (
    <div className="balance-ledger-page">
      <div className="page-header">
        <h2>Balance Ledger</h2>
        <p className="page-subtitle">Complete financial movement history for {siteData.locationName} site</p>
      </div>

      <div className="table-container">
        <table className="data-table ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Description</th>
              <th>Money In</th>
              <th>Money Out</th>
              <th>Balance</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry, index) => (
              <tr key={index} className={entry.type === "Company Funding" ? "funding-row" : "expense-row"}>
                <td>{entry.date}</td>
                <td>
                  <span className={`type-badge ${entry.type.toLowerCase().replace(" ", "-")}`}>
                    {entry.type}
                  </span>
                </td>
                <td>{entry.description}</td>
                <td className={entry.moneyIn > 0 ? "positive" : ""}>
                  {entry.moneyIn > 0 ? `+${currencySymbol}${entry.moneyIn.toLocaleString()}` : "—"}
                </td>
                <td className={entry.moneyOut > 0 ? "negative" : ""}>
                  {entry.moneyOut > 0 ? `-${currencySymbol}${entry.moneyOut.toLocaleString()}` : "—"}
                </td>
                <td className="balance">{currencySymbol}${entry.balance.toLocaleString()}</td>
                <td>{entry.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ledger-summary">
        <div className="summary-item">
          <span>Total Money In</span>
          <span className="positive">
            {`+${currencySymbol}${totalMoneyIn.toLocaleString()}`}
          </span>
        </div>
        <div className="summary-item">
          <span>Total Money Out</span>
          <span className="negative">
            {`-${currencySymbol}${totalMoneyOut.toLocaleString()}`}
          </span>
        </div>
        <div className="summary-item highlight">
          <span>Current Balance</span>
          <span className="balance">
            {`${currencySymbol}${currentBalance.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}