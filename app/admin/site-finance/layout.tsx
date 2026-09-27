"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SITE_LOCATIONS } from "@/app/admin/_lib/site-finance-data";
import { downloadCSV } from "@/app/admin/_lib/locations-data";
import { SiteFinanceProvider } from "./_components/SiteFinanceContext";
import { SiteFinanceHeader } from "./_components/SiteFinanceHeader";
import { SummaryCards } from "./_components/SummaryCards";
import AddFundsModal from "./_components/AddFundsModal";
import AddExpenseModal from "./_components/AddExpenseModal";

export default function SiteFinanceLayout({ children }: { children: React.ReactNode }) {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <SiteFinanceProvider>
      <SiteFinanceLayoutInner
        showAddFunds={showAddFunds}
        setShowAddFunds={setShowAddFunds}
        showAddExpense={showAddExpense}
        setShowAddExpense={setShowAddExpense}
      >
        {children}
      </SiteFinanceLayoutInner>
    </SiteFinanceProvider>
  );
}

function SiteFinanceLayoutInner({
  children,
  showAddFunds,
  setShowAddFunds,
  showAddExpense,
  setShowAddExpense,
}: {
  children: React.ReactNode;
  showAddFunds: boolean;
  setShowAddFunds: (v: boolean) => void;
  showAddExpense: boolean;
  setShowAddExpense: (v: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("overview");

  const tabs = [
    { id: "overview", label: "Overview", href: "/admin/site-finance" },
    { id: "site-funds", label: "Funds Received", href: "/admin/site-finance/site-funds" },
    { id: "expenses", label: "Expenses", href: "/admin/site-finance/expenses" },
    { id: "balance-ledger", label: "Balance Ledger", href: "/admin/site-finance/balance-ledger" },
    { id: "reports", label: "Reports", href: "/admin/site-finance/reports" },
  ];

  return (
    <div className="site-finance-layout">
      <SiteFinanceHeader
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        router={router}
        showAddFunds={showAddFunds}
        setShowAddFunds={setShowAddFunds}
        showAddExpense={showAddExpense}
        setShowAddExpense={setShowAddExpense}
      />
      <SummaryCards />
      <main className="site-finance-main">{children}</main>

      <AddFundsModal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        onSubmit={(data) => console.log("Add Funds:", data)}
      />
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSubmit={(data) => console.log("Add Expense:", data)}
      />
    </div>
  );
}