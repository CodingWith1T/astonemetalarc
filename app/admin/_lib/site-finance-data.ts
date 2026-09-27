import { initialLocations } from "./locations-data";

export interface LocationConfig {
  id: string;
  name: string;
  country: string;
  currency: string;
  currencySymbol: string;
  reportingCurrency: string;
  reportingCurrencySymbol: string;
  defaultExchangeRate: number;
}

export interface SiteFundTransaction {
  id: string;
  date: string;
  amountUSD: number;
  exchangeRate: number;
  inrValue: number;
  previousBalance: number;
  availableFunds: number;
  expenses: number;
  closingBalance: number;
  paymentMethod: string;
  sentBy: string;
  reference: string;
  notes: string;
  attachment?: string;
  expenseItems?: SiteExpenseItem[];
}

export interface SiteExpenseItem {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  project: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paidBy: string;
  receipt?: string;
  notes: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
}

export interface SiteFinanceSummary {
  totalFundsSent: number;
  totalExpenses: number;
  currentBalance: number;
  transactionCount: number;
  totalINRValue: number;
}

export interface SiteFinanceData {
  locationId: string;
  locationName: string;
  currency: string;
  currencySymbol: string;
  reportingCurrency: string;
  reportingCurrencySymbol: string;
  exchangeRate: number;
  transactions: SiteFundTransaction[];
  summary: SiteFinanceSummary;
}

export const EXPENSE_CATEGORIES = {
  Labour: [
    "Mason",
    "Helper",
    "Painter",
    "Putty Worker",
    "Scriper",
    "Welder",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Security",
    "Other Labour",
  ],
  Materials: [
    "Cement",
    "Sand",
    "Bricks",
    "Putty",
    "Primer",
    "Paint",
    "Steel",
    "Wood",
    "Electrical Material",
    "Plumbing Material",
    "Hardware",
  ],
  "Site Operations": [
    "Petrol",
    "Diesel",
    "Transportation",
    "Equipment Rental",
    "Scaffolding",
    "Welding",
    "Tools",
    "Repairs",
    "Site Cleaning",
    "Water",
  ],
  "Food / Daily Requirements": [
    "Grocery",
    "Drinking Water",
    "Meals",
    "Tea / Refreshments",
  ],
  "Staff / Miscellaneous": [
    "Staff Expenses",
    "Communication",
    "Haircut",
    "Travel",
    "Accommodation",
    "Other",
  ],
};

export const PROJECTS = [
  { id: "all", name: "All Projects" },
  { id: "buchanan", name: "Buchanan Renovation" },
  { id: "admin-building", name: "Administration Building" },
  { id: "warehouse", name: "Warehouse Project" },
];

export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque", "UPI", "Card"];
export const APPROVAL_STATUSES = ["Approved", "Pending", "Rejected"];

export const SITE_LOCATIONS = initialLocations.map(loc => ({
  id: loc.id,
  name: loc.name,
  country: loc.country,
  currency: loc.currency === "$" ? "USD" : "INR",
  currencySymbol: loc.currency,
  reportingCurrency: loc.currency === "$" ? "INR" : "USD",
  reportingCurrencySymbol: loc.currency === "$" ? "₹" : "$",
  defaultExchangeRate: loc.currency === "$" ? 102 : 0.012,
}));

function createMockTransactions(locationId: string) {
  if (locationId === "monrovia") {
    return [
      {
        id: "sf-001",
        date: "23 Sep 2026",
        amountUSD: 975,
        exchangeRate: 102,
        inrValue: 99450,
        previousBalance: 0,
        availableFunds: 975,
        expenses: 520,
        closingBalance: 455,
        paymentMethod: "Bank Transfer",
        sentBy: "Company / Head Office",
        reference: "TRX-001",
        notes: "Initial site funding",
        expenseItems: [
          { id: "exp-001", date: "23 Sep 2026", category: "Labour", subcategory: "Helper", description: "Site labour", project: "Buchanan Renovation", amount: 200, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Site labour payment", approvalStatus: "Approved" as const },
          { id: "exp-002", date: "23 Sep 2026", category: "Materials", subcategory: "Cement", description: "Cement bags", project: "Buchanan Renovation", amount: 150, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Cement purchase", approvalStatus: "Approved" as const },
          { id: "exp-003", date: "23 Sep 2026", category: "Site Operations", subcategory: "Petrol", description: "Site petrol", project: "Buchanan Renovation", amount: 80, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Petrol for site vehicles", approvalStatus: "Approved" as const },
          { id: "exp-004", date: "23 Sep 2026", category: "Food / Daily Requirements", subcategory: "Grocery", description: "Site grocery", project: "Buchanan Renovation", amount: 50, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Grocery for site staff", approvalStatus: "Approved" as const },
          { id: "exp-005", date: "23 Sep 2026", category: "Staff / Miscellaneous", subcategory: "Other", description: "Miscellaneous expenses", project: "Buchanan Renovation", amount: 40, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Other site expenses", approvalStatus: "Approved" as const },
        ],
      },
      {
        id: "sf-002",
        date: "25 Sep 2026",
        amountUSD: 2930,
        exchangeRate: 102,
        inrValue: 298860,
        previousBalance: 455,
        availableFunds: 3385,
        expenses: 2135,
        closingBalance: 1250,
        paymentMethod: "Bank Transfer",
        sentBy: "Company / Head Office",
        reference: "TRX-002",
        notes: "Second site funding",
        expenseItems: [
          { id: "exp-006", date: "25 Sep 2026", category: "Labour", subcategory: "Weekly Labour", description: "Weekly labour payment", project: "Buchanan Renovation", amount: 1745, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Weekly site labour payment", approvalStatus: "Approved" as const },
          { id: "exp-007", date: "25 Sep 2026", category: "Staff / Miscellaneous", subcategory: "Haircut", description: "Abhishek Haircut", project: "Site", amount: 15, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Staff haircut", approvalStatus: "Approved" as const },
          { id: "exp-008", date: "25 Sep 2026", category: "Staff / Miscellaneous", subcategory: "Haircut", description: "Ashwani Haircut", project: "Site", amount: 15, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Staff haircut", approvalStatus: "Approved" as const },
          { id: "exp-009", date: "25 Sep 2026", category: "Food / Daily Requirements", subcategory: "Grocery", description: "Site grocery", project: "Site", amount: 40, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Grocery for site staff", approvalStatus: "Approved" as const },
          { id: "exp-010", date: "25 Sep 2026", category: "Site Operations", subcategory: "Welding", description: "Scaffolding welding", project: "Buchanan Renovation", amount: 320, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Scaffolding welding work", approvalStatus: "Approved" as const },
        ],
      },
    ];
  }

  if (locationId === "gurgaon") {
    return [
      {
        id: "sf-gur-001",
        date: "15 Sep 2026",
        amountUSD: 50000,
        exchangeRate: 83,
        inrValue: 4150000,
        previousBalance: 0,
        availableFunds: 50000,
        expenses: 35000,
        closingBalance: 15000,
        paymentMethod: "Bank Transfer",
        sentBy: "Company / Head Office",
        reference: "TRX-GUR-001",
        notes: "Gurgaon project funding",
        expenseItems: [
          { id: "exp-gur-001", date: "15 Sep 2026", category: "Labour", subcategory: "Mason", description: "Foundation work", project: "Warehouse Complex", amount: 15000, currency: "USD", paymentMethod: "Cash", paidBy: "Site Engineer", notes: "Foundation labour", approvalStatus: "Approved" as const },
          { id: "exp-gur-002", date: "15 Sep 2026", category: "Materials", subcategory: "Steel", description: "Steel reinforcement", project: "Warehouse Complex", amount: 20000, currency: "USD", paymentMethod: "Bank Transfer", paidBy: "Procurement", notes: "Steel bars", approvalStatus: "Approved" as const },
        ],
      },
    ];
  }

  if (locationId === "mumbai") {
    return [
      {
        id: "sf-mum-001",
        date: "20 Sep 2026",
        amountUSD: 30000,
        exchangeRate: 83,
        inrValue: 2490000,
        previousBalance: 0,
        availableFunds: 30000,
        expenses: 18000,
        closingBalance: 12000,
        paymentMethod: "Bank Transfer",
        sentBy: "Company / Head Office",
        reference: "TRX-MUM-001",
        notes: "Mumbai warehouse funding",
        expenseItems: [
          { id: "exp-mum-001", date: "20 Sep 2026", category: "Labour", subcategory: "Helper", description: "Site preparation", project: "Industrial Warehouse", amount: 8000, currency: "USD", paymentMethod: "Cash", paidBy: "Project Manager", notes: "Site prep labour", approvalStatus: "Approved" as const },
          { id: "exp-mum-002", date: "20 Sep 2026", category: "Materials", subcategory: "Cement", description: "Cement bags", project: "Industrial Warehouse", amount: 10000, currency: "USD", paymentMethod: "Bank Transfer", paidBy: "Procurement", notes: "Cement purchase", approvalStatus: "Approved" as const },
        ],
      },
    ];
  }

  if (locationId === "aligarh") {
    return [
      {
        id: "sf-ali-001",
        date: "10 Sep 2026",
        amountUSD: 20000,
        exchangeRate: 83,
        inrValue: 1660000,
        previousBalance: 0,
        availableFunds: 20000,
        expenses: 12000,
        closingBalance: 8000,
        paymentMethod: "Bank Transfer",
        sentBy: "Company / Head Office",
        reference: "TRX-ALI-001",
        notes: "Aligarh PEB funding",
        expenseItems: [
          { id: "exp-ali-001", date: "10 Sep 2026", category: "Labour", subcategory: "Welder", description: "Steel fabrication", project: "PEB Structure", amount: 7000, currency: "USD", paymentMethod: "Cash", paidBy: "Site Engineer", notes: "Welding labour", approvalStatus: "Approved" as const },
          { id: "exp-ali-002", date: "10 Sep 2026", category: "Materials", subcategory: "Steel", description: "Steel sections", project: "PEB Structure", amount: 5000, currency: "USD", paymentMethod: "Bank Transfer", paidBy: "Procurement", notes: "Steel sections", approvalStatus: "Approved" as const },
        ],
      },
    ];
  }

  return [];
}

export function getSiteFinanceData(locationId: string): SiteFinanceData {
  const location = initialLocations.find(l => l.id === locationId);
  const locationConfig = SITE_LOCATIONS.find(l => l.id === locationId);

  if (!location || !locationConfig) {
    return getSiteFinanceData("monrovia");
  }

  const transactions = createMockTransactions(locationId);

  const totalFundsSent = transactions.reduce((sum, t) => sum + t.amountUSD, 0);
  const totalExpenses = transactions.reduce((sum, t) => sum + t.expenses, 0);
  const currentBalance = transactions[transactions.length - 1]?.closingBalance || 0;
  const totalINRValue = transactions.reduce((sum, t) => sum + t.inrValue, 0);

  const summary: SiteFinanceSummary = {
    totalFundsSent,
    totalExpenses,
    currentBalance,
    transactionCount: transactions.length,
    totalINRValue,
  };

  return {
    locationId,
    locationName: location.name,
    currency: locationConfig.currency,
    currencySymbol: locationConfig.currencySymbol,
    reportingCurrency: locationConfig.reportingCurrency,
    reportingCurrencySymbol: locationConfig.reportingCurrencySymbol,
    exchangeRate: locationConfig.defaultExchangeRate,
    transactions,
    summary,
  };
}

export function getAllExpenses(locationId: string): SiteExpenseItem[] {
  const data = getSiteFinanceData(locationId);
  return data.transactions.flatMap(t => t.expenseItems || []);
}

export function getSiteFundTransaction(locationId: string, id: string): SiteFundTransaction | undefined {
  const data = getSiteFinanceData(locationId);
  return data.transactions.find(t => t.id === id);
}

export function getExpensesByTransactionId(locationId: string, transactionId: string): SiteExpenseItem[] {
  const transaction = getSiteFundTransaction(locationId, transactionId);
  return transaction?.expenseItems || [];
}

export function formatCurrencyUSD(amount: number): string {
  return `$${Math.abs(amount).toLocaleString()}`;
}

export function formatCurrencyINR(amount: number): string {
  return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
}

export function formatCurrency(amount: number, currency: string): string {
  if (currency === "USD" || currency === "$") {
    return formatCurrencyUSD(amount);
  }
  return formatCurrencyINR(amount);
}