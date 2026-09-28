"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEPARTMENTS,
  MONTHLY_SPEND,
  Office,
  formatDateShort,
  formatINR,
  type OfficeExpense,
} from "../_lib/office-data";
import { useOffice } from "../_lib/OfficeContext";
import { useOfficeUI } from "../_components/OfficeShell";
import { Card, StatCard, PageHead } from "@/app/admin/_lib/finance/table-kit";
import { DepartmentBarChart, DonutChart, FundsFlowChart, MonthlyTrendChart } from "@/app/admin/_lib/finance/charts";
import ExpenseDetailDrawer from "../_components/ExpenseDetailDrawer";
import {
  EmptyState,
  IconArrowDown,
  IconArrowUp,
  IconBox,
  IconChart,
  IconCheck,
  IconClipboard,
  IconCash,
  IconPlus,
  IconReceipt,
  IconScale,
  IconStore,
  IconWallet,
} from "@/app/admin/_lib/finance/ui";

const QUICK_ACTIONS = [
  { label: "Add Funds", icon: <IconWallet size={17} />, target: "funds" as const, path: "/admin/office/funds" },
  { label: "Add Expense", icon: <IconReceipt size={17} />, target: "expense" as const, path: "/admin/office/expenses" },
  { label: "Petty Cash", icon: <IconCash size={17} />, target: "pettyCash" as const, path: "/admin/office/petty-cash" },
  { label: "New Request", icon: <IconClipboard size={17} />, target: "request" as const, path: "/admin/office/requests" },
  { label: "Add Vendor", icon: <IconStore size={17} />, target: "vendor" as const, path: "/admin/office/vendors" },
  { label: "Add Asset", icon: <IconBox size={17} />, target: "asset" as const, path: "/admin/office/assets" },
  { label: "View Reports", icon: <IconChart size={17} />, target: null, path: "/admin/office/reports" },
];

export default function OfficeOverview() {
  const office = useOffice();
  const { open } = useOfficeUI();
  const router = useRouter();
  const [drawerExpense, setDrawerExpense] = useState<OfficeExpense | null>(null);

  const {
    totalFundsReceived,
    openingBalance,
    totalAvailableFunds,
    totalExpenses,
    approvedExpenses,
    pendingExpenses,
    closingBalance,
    expenseCount,
    pettyCashBalance,
    pendingApprovals,
    pendingPayables,
    recentTransactions,
    expenses,
  } = office;

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.subcategory] = (map[e.subcategory] ?? 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 9);
  }, [expenses]);

  const departmentData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.department] = (map[e.department] ?? 0) + e.amount;
    });
    return DEPARTMENTS.map((d) => ({ name: d, value: map[d] ?? 0 })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  return (
    <div className="fin-page">
      <PageHead
        title="Office Management"
        subtitle={`${Office.shortName} · ${Office.line} · ${Office.month}`}
        actions={
          <>
            <button className="fin-btn fin-btn-ghost" onClick={() => open("funds")}>
              <IconPlus /> Add Funds
            </button>
            <button className="fin-btn fin-btn-primary" onClick={() => open("expense")}>
              <IconPlus /> Add Expense
            </button>
          </>
        }
      />

      {/* Primary financial cards */}
      <div className="fin-stats fin-stats-4">
        <StatCard
          label="Total Funds Received"
          value={formatINR(totalFundsReceived)}
          icon={<IconWallet size={18} />}
          trend="3 funding entries"
          trendTone="up"
          sub={`Opening ₹${openingBalance.toLocaleString("en-IN")} carried forward`}
          onClick={() => router.push("/admin/office/funds")}
        />
        <StatCard
          label="Total Office Expenses"
          value={formatINR(totalExpenses)}
          icon={<IconReceipt size={18} />}
          trend={`₹${pendingExpenses.toLocaleString("en-IN")} pending`}
          trendTone="down"
          sub={`₹${approvedExpenses.toLocaleString("en-IN")} approved`}
          onClick={() => router.push("/admin/office/expenses")}
        />
        <StatCard
          label="Available Balance"
          value={formatINR(closingBalance)}
          icon={<IconScale size={18} />}
          trend={`${Math.round((closingBalance / totalAvailableFunds) * 100)}% of available funds`}
          trendTone="flat"
          sub="Available funds − office expenses"
          onClick={() => router.push("/admin/office/balance-ledger")}
        />
        <StatCard
          label="Pending Approvals"
          value={String(pendingApprovals)}
          icon={<IconCheck size={18} />}
          trend="Needs action"
          trendTone="down"
          sub="Expenses + requests awaiting sign-off"
          onClick={() => router.push("/admin/office/approvals")}
        />
      </div>

      {/* Financial summary flow */}
      <Card
        title={`${Office.shortName} — ${Office.month}`}
        subtitle="Opening balance + new funds received = available funds · available funds − office expenses = closing balance"
        className="fin-card-flow"
        action={
          <span className="fin-card-chip">Office finance only · site finance excluded</span>
        }
      >
        <div className="fin-flow">
          <div className="fin-flow-step">
            <span className="fin-flow-label">Opening Balance</span>
            <strong className="fin-flow-value">{formatINR(openingBalance)}</strong>
            <span className="fin-flow-note">Carried from August — not a fund receipt</span>
          </div>
          <div className="fin-flow-connector">
            <span className="fin-flow-op">+</span>
            <span className="fin-flow-line" />
            <span className="fin-flow-caption">New Funds Received</span>
          </div>
          <div className="fin-flow-step">
            <span className="fin-flow-label">New Funds Received</span>
            <strong className="fin-flow-value positive">{formatINR(totalFundsReceived, true)}</strong>
            <span className="fin-flow-note">{office.funds.filter((f) => f.source !== "Carried Forward").length} transfers from Head Office</span>
          </div>
          <div className="fin-flow-connector">
            <span className="fin-flow-op">=</span>
            <span className="fin-flow-line" />
            <span className="fin-flow-caption">Available Funds</span>
          </div>
          <div className="fin-flow-step is-total">
            <span className="fin-flow-label">Available Funds</span>
            <strong className="fin-flow-value available">{formatINR(totalAvailableFunds)}</strong>
            <span className="fin-flow-note">
              {formatINR(openingBalance)} + {formatINR(totalFundsReceived)}
            </span>
          </div>
          <div className="fin-flow-connector">
            <span className="fin-flow-op">−</span>
            <span className="fin-flow-line" />
            <span className="fin-flow-caption">Office Expenses</span>
          </div>
          <div className="fin-flow-step">
            <span className="fin-flow-label">Office Expenses</span>
            <strong className="fin-flow-value negative">−{formatINR(totalExpenses)}</strong>
            <span className="fin-flow-note">{expenseCount} expense entries</span>
          </div>
          <div className="fin-flow-connector">
            <span className="fin-flow-op">=</span>
            <span className="fin-flow-line" />
            <span className="fin-flow-caption">Closing Balance</span>
          </div>
          <div className="fin-flow-step is-closing">
            <span className="fin-flow-label">Closing Balance</span>
            <strong className="fin-flow-value closing">{formatINR(closingBalance)}</strong>
            <span className="fin-flow-note">Office funds carried to next period</span>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="fin-grid-2">
        <Card title="Financial Overview" subtitle="Funds → Expenses → Balance for the period">
          <FundsFlowChart
            opening={openingBalance}
            funds={totalFundsReceived}
            available={totalAvailableFunds}
            expenses={totalExpenses}
            closing={closingBalance}
          />
        </Card>
        <Card title="Office Expense Breakdown" subtitle="Category-wise distribution for September 2026">
          <DonutChart data={categoryData} />
        </Card>
      </div>

      <div className="fin-grid-2">
        <Card
          title="Department Expenses"
          subtitle="Click a department to filter the expense list"
          action={
            <button className="fin-link-btn" onClick={() => router.push("/admin/office/departments")}>
              View all
            </button>
          }
        >
          <DepartmentBarChart data={departmentData} height={280} />
        </Card>
        <Card title="Monthly Spending" subtitle="June → September 2026">
          <MonthlyTrendChart data={MONTHLY_SPEND} />
        </Card>
      </div>

      <div className="fin-grid-2 fin-grid-2-wide-left">
        <Card
          title="Recent Transactions"
          subtitle="Latest office financial activity"
          action={
            <button className="fin-link-btn" onClick={() => router.push("/admin/office/balance-ledger")}>
              Full ledger
            </button>
          }
        >
          {recentTransactions.length === 0 ? (
            <EmptyState title="No transactions yet" message="Add funds or an expense to start the office ledger." />
          ) : (
            <ul className="fin-tx-list">
              {recentTransactions.map((t) => {
                const expense = expenses.find((e) => e.id === t.sourceId);
                return (
                  <li key={t.id}>
                    <button className="fin-tx" onClick={() => expense && setDrawerExpense(expense)} disabled={!expense}>
                      <span className="fin-tx-date">{formatDateShort(t.date)}</span>
                      <span className="fin-tx-main">
                        <strong>{t.description}</strong>
                        <span>
                          {t.transaction} · {t.reference}
                        </span>
                      </span>
                      <span className={`fin-tx-amount ${t.moneyIn ? "in" : "out"}`}>
                        {t.moneyIn ? (
                          <>
                            <IconArrowUp size={13} /> {formatINR(t.moneyIn)}
                          </>
                        ) : t.moneyOut ? (
                          <>
                            <IconArrowDown size={13} /> −{formatINR(t.moneyOut)}
                          </>
                        ) : (
                          formatINR(0)
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="fin-col-stack">
          <Card title="Quick Actions" subtitle="Common office finance tasks">
            <div className="fin-quick">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  className="fin-quick-btn"
                  onClick={() => (a.target ? open(a.target) : router.push(a.path))}
                >
                  <span className="fin-quick-icon">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Office Snapshot" subtitle="Supplementary office metrics">
            <div className="fin-mini-stats">
              <div>
                <span>Petty Cash Balance</span>
                <strong>{formatINR(pettyCashBalance)}</strong>
              </div>
              <div>
                <span>Pending Payables</span>
                <strong className="warn">{formatINR(pendingPayables)}</strong>
              </div>
              <div>
                <span>Active Vendors</span>
                <strong>{office.vendors.filter((v) => v.status === "Active").length}</strong>
              </div>
              <div>
                <span>Tracked Assets</span>
                <strong>{office.assets.length}</strong>
              </div>
              <div>
                <span>Open Requests</span>
                <strong>{office.requests.filter((r) => ["Submitted", "Pending Approval", "Draft"].includes(r.status)).length}</strong>
              </div>
              <div>
                <span>Expense Entries</span>
                <strong>{expenseCount}</strong>
              </div>
            </div>
            <div className="fin-note">
              <strong>Finance separation:</strong> Office finance (rent, utilities, salaries, vendors, assets, petty
              cash) is tracked here. Construction site finance — labour, materials, petrol, grocery, scaffolding,
              welding, cement, procurement — is tracked separately under Construction.
            </div>
          </Card>
        </div>
      </div>

      <ExpenseDetailDrawer expense={drawerExpense} onClose={() => setDrawerExpense(null)} />
    </div>
  );
}
