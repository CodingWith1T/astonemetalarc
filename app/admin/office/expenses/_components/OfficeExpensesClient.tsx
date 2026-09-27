"use client";

import { useState } from "react";
import { downloadCSV } from "../../_lib/csv";
import {
  DEPARTMENTS,
  Office,
  formatDateShort,
  formatINR,
  type OfficeExpense,
} from "../../_lib/office-data";
import { useOffice } from "../../_lib/OfficeContext";
import { useOfficeUI } from "../../_components/OfficeShell";
import {
  Card,
  FiltersBar,
  PageHead,
  SortHeader,
  StatCard,
  TotalsFooter,
  useTableControls,
  type FilterDef,
} from "../../_components/table-kit";
import ExpenseDetailDrawer from "../../_components/ExpenseDetailDrawer";
import { EmptyState, IconCheck, IconClock, IconDownload, IconPlus, IconReceipt, StatusBadge } from "../../_components/ui";
import { AmountCell } from "../../_components/table-kit";

const FILTERS: FilterDef[] = [
  { key: "category", label: "Category", options: ["Office Administration", "Employee", "Transportation", "Technology", "Professional", "Other"], allLabel: "All Categories" },
  { key: "department", label: "Department", options: [...DEPARTMENTS], allLabel: "All Departments" },
  { key: "paymentMethod", label: "Payment Method", options: ["Bank Transfer", "Cash", "Cheque", "UPI", "Card"] },
  { key: "status", label: "Status", options: ["Draft", "Submitted", "Pending Approval", "Approved", "Rejected", "Paid"], allLabel: "All Status" },
];

export default function OfficeExpensesClient() {
  const { expenses, totalExpenses, approvedExpenses, pendingExpenses, toast } = useOffice();
  const { open } = useOfficeUI();
  const [drawer, setDrawer] = useState<OfficeExpense | null>(null);

  const controls = useTableControls<Record<string, unknown>>({
    rows: expenses as unknown as Record<string, unknown>[],
    pageSize: 10,
    searchFields: (r) => [String(r.id), String(r.description), String(r.subcategory), String(r.vendor), String(r.paidBy)],
    filters: FILTERS,
    defaultSort: { key: "date", dir: "desc" },
  });

  const handleExport = () => {
    downloadCSV(
      "ghaziabad-office-expenses-sep-2026.csv",
      ["Date", "Expense ID", "Category", "Subcategory", "Description", "Department", "Amount (₹)", "Payment Method", "Paid By", "Vendor", "Status"],
      controls.sorted.map((r) => {
        const e = r as unknown as OfficeExpense;
        return [
          e.date,
          e.id,
          e.category,
          e.subcategory,
          e.description,
          e.department,
          String(e.amount),
          e.paymentMethod,
          e.paidBy,
          e.vendor,
          e.status,
        ];
      })
    );
    toast({ tone: "success", title: "Export ready", message: `${controls.sorted.length} expense rows exported to CSV.` });
  };

  return (
    <div className="of-page">
      <PageHead
        title="Office Expenses"
        subtitle={`${Office.shortName} · ${Office.line} · ${Office.month}`}
        actions={
          <>
            <button className="of-btn of-btn-ghost" onClick={handleExport}>
              <IconDownload /> Export
            </button>
            <button className="of-btn of-btn-primary" onClick={() => open("expense")}>
              <IconPlus /> Add Expense
            </button>
          </>
        }
      />

      <div className="of-stats of-stats-4">
        <StatCard label="This Month" value={formatINR(totalExpenses)} icon={<IconReceipt size={18} />} sub={`${expenses.length} expense entries`} />
        <StatCard label="Approved" value={formatINR(approvedExpenses)} icon={<IconCheck size={18} />} trend="Settled against office funds" trendTone="up" />
        <StatCard label="Pending" value={formatINR(pendingExpenses)} icon={<IconClock size={18} />} trend="Awaiting approval" trendTone="down" />
        <StatCard label="Number of Expenses" value={String(expenses.length)} icon={<IconReceipt size={18} />} sub="Office finance only" />
      </div>

      <FiltersBar
        controls={controls}
        filters={FILTERS}
        extra={
          <span className="of-filter-total">
            Filtered total <strong>{formatINR(controls.sum)}</strong>
          </span>
        }
      />

      <div className="of-table-wrap">
        <div className="of-table-scroll">
          <table className="of-table">
            <thead>
              <tr>
                <SortHeader label="Date" sortKey="date" controls={controls} />
                <SortHeader label="Expense ID" sortKey="id" controls={controls} />
                <SortHeader label="Category" sortKey="category" controls={controls} />
                <th>Description</th>
                <SortHeader label="Department" sortKey="department" controls={controls} />
                <SortHeader label="Amount" sortKey="amount" controls={controls} align="right" />
                <SortHeader label="Status" sortKey="status" controls={controls} />
                <th className="of-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {controls.pageRows.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No expenses match your filters"
                      message="Adjust the filters or add a new office expense entry."
                      action={
                        <button className="of-btn of-btn-primary" onClick={() => open("expense")}>
                          <IconPlus /> Add Expense
                        </button>
                      }
                    />
                  </td>
                </tr>
              )}
              {controls.pageRows.map((r) => {
                const e = r as unknown as OfficeExpense;
                return (
                  <tr key={e.id} className="of-row-click" onClick={() => setDrawer(e)}>
                    <td className="of-strong">{formatDateShort(e.date)}</td>
                    <td className="of-mono">{e.id}</td>
                    <td><span className="of-chip">{e.subcategory}</span></td>
                    <td>
                      <span className="of-cell-title">{e.description}</span>
                      <span className="of-cell-sub">{e.paymentMethod} · {e.vendor}</span>
                    </td>
                    <td>{e.department}</td>
                    <td className="of-td-right"><AmountCell amount={e.amount} /></td>
                    <td><StatusBadge status={e.status} /></td>
                    <td className="of-td-center">
                      <button
                        className="of-row-btn"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setDrawer(e);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TotalsFooter label={`Total — ${controls.total} entries`} amount={controls.sum} />
      </div>

      <Card title="Category Reference" subtitle="Office expense categories available in the Add Expense form">
        <div className="of-cat-grid">
          {[
            ["Office Administration", "Office Rent · Electricity · Water · Internet · Telephone · Stationery · Printing · Supplies · Cleaning · Security · Maintenance · Furniture · Equipment"],
            ["Employee", "Salary · Salary Advance · Travel · Meals · Welfare · Medical · Training · Recruitment · Reimbursement"],
            ["Transportation", "Fuel · Taxi · Local Transportation · Vehicle Maintenance · Vehicle Repair · Parking · Toll"],
            ["Technology", "Software Subscription · Hosting · Domain · Cloud Services · Computer Equipment · IT Support · Mobile Recharge"],
            ["Professional", "Legal Fees · Accounting Fees · Consultancy · Government Fees · Bank Charges"],
            ["Other", "Miscellaneous · Emergency · Other"],
          ].map(([group, items]) => (
            <div key={group} className="of-cat-card">
              <strong>{group}</strong>
              <p>{items}</p>
            </div>
          ))}
        </div>
      </Card>

      <ExpenseDetailDrawer expense={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}
