"use client";

import { useState, useMemo } from "react";
import { useSiteFinance } from "@/app/admin/site-finance/_components/SiteFinanceContext";
import { EXPENSE_CATEGORIES, PROJECTS, PAYMENT_METHODS, APPROVAL_STATUSES, SiteExpenseItem } from "@/app/admin/_lib/site-finance-data";

export default function ExpensesClient() {
  const { siteData, getAllExpenses } = useSiteFinance();
  const allExpenses: SiteExpenseItem[] = getAllExpenses(siteData.locationId);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    project: "all",
    category: "all",
    paymentMethod: "all",
    status: "all",
    search: "",
  });

  const categories = ["all", ...Object.keys(EXPENSE_CATEGORIES)];
  const subcategories = useMemo(() => {
    if (filters.category === "all") return ["all"];
    return ["all", ...(EXPENSE_CATEGORIES[filters.category as keyof typeof EXPENSE_CATEGORIES] || [])];
  }, [filters.category]);

  const [subcategory, setSubcategory] = useState("all");

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((expense) => {
      if (filters.project !== "all" && expense.project !== filters.project) return false;
      if (filters.category !== "all" && expense.category !== filters.category) return false;
      if (subcategory !== "all" && expense.subcategory !== subcategory) return false;
      if (filters.paymentMethod !== "all" && expense.paymentMethod !== filters.paymentMethod) return false;
      if (filters.status !== "all" && expense.approvalStatus !== filters.status) return false;
      if (
        filters.search &&
        !expense.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !expense.project.toLowerCase().includes(filters.search.toLowerCase()) &&
        !expense.category.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [allExpenses, filters, subcategory]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "category") setSubcategory("all");
  };

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [filteredExpenses]);

  const grandTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const currencySymbol = siteData.currencySymbol || "$";

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h2>Expenses</h2>
        <p className="page-subtitle">{siteData.locationName} site expense management</p>
      </div>

      <div className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Project</label>
            <select value={filters.project} onChange={(e) => handleFilterChange("project", e.target.value)}>
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Subcategory</label>
            <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
              {subcategories.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Subcategories" : s}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Payment Method</label>
            <select value={filters.paymentMethod} onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}>
              <option value="all">All Methods</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
              <option value="all">All Status</option>
              {APPROVAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search expenses..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="category-summary-bar">
        {Object.entries(categoryTotals).map(([cat, total]) => (
          <div key={cat} className="cat-summary">
            <span>{cat}</span>
            <span className="negative">{currencySymbol}{total.toLocaleString()}</span>
          </div>
        ))}
        <div className="cat-summary total">
          <span>Total</span>
          <span className="negative">{currencySymbol}{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Description</th>
              <th>Project</th>
              <th>Paid By</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>
                  <span className="category-badge">{expense.category}</span>
                </td>
                <td>{expense.subcategory}</td>
                <td>{expense.description}</td>
                <td>{expense.project}</td>
                <td>{expense.paidBy}</td>
                <td className="negative">{currencySymbol}{expense.amount.toLocaleString()}</td>
                <td>{expense.paymentMethod}</td>
                <td>
                  <span className={`status-badge ${expense.approvalStatus.toLowerCase()}`}>
                    {expense.approvalStatus}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" onClick={() => console.log("View expense", expense.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={10} className="no-data">
                  No expenses found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>Showing {filteredExpenses.length} expenses</span>
      </div>
    </div>
  );
}