/**
 * Site Finance data model for Astone Metal Arc construction sites.
 *
 * Design rules that this model enforces, because a construction finance
 * module that breaks them is not usable by a site accountant:
 *
 *  1. A site expense is a FIRST-CLASS record, not a child of a remittance.
 *     Site cash is spent continuously between remittances, so nesting
 *     expenses under fund transfers makes the running balance meaningless.
 *
 *  2. Every amount is in the SITE's own currency. A Gurgaon site spends INR;
 *     a Liberia site spends USD. We never label INR spend as "amountUSD".
 *
 *  3. The INR value of a foreign site is derived via an explicit rate on the
 *     remittance, so group reporting never invents a conversion.
 *
 *  4. ALL totals are derived. No page may assert a total that disagrees with
 *     its own line items — that is the fastest way to lose a client's trust.
 *
 *  5. Dates are ISO (YYYY-MM-DD) so sorting, filtering and period maths work.
 */

import { formatINR, formatMoney, formatPercent } from "./format";

/* ------------------------------------------------------------------ */
/* Cost structure — the language of a construction company            */
/* ------------------------------------------------------------------ */

export const COST_GROUPS = [
  "Labour",
  "Material",
  "Subcontractor",
  "Machinery",
  "Equipment Hire",
  "Site Overheads",
  "Professional Fees",
] as const;

export type CostGroup = (typeof COST_GROUPS)[number];

/** Sub-cost-heads per group. These are what a site engineer actually books against. */
export const COST_HEADS: Record<CostGroup, string[]> = {
  Labour: [
    "Skilled Labour — Mason / Steel Fixer",
    "Unskilled Labour — Helper",
    "Carpentry Labour",
    "Electrical Labour",
    "Plumbing Labour",
    "Painting / Putty Labour",
    "Welder / Fabricator",
    "Site Supervisor Wages",
    "Security Staff Wages",
  ],
  Material: [
    "Cement — OPC / PPC",
    "Steel — TMT Bar",
    "Structural Steel — Section",
    "Bricks / Blockwork",
    "Aggregate — Sand / Stone",
    "Roofing & Sheeting",
    "Electrical Material",
    "Plumbing Material",
    "Finishes — Paint / Putty",
    "Fasteners & Hardware",
  ],
  Subcontractor: [
    "Piling Subcontractor",
    "Excavation Subcontractor",
    "Shuttering Subcontractor",
    "Waterproofing Subcontractor",
    "Facade Subcontractor",
    "MEP Subcontractor",
    "FLooring Subcontractor",
  ],
  Machinery: [
    "Excavator / JCB",
    "Crane — Mobile / Tower",
    "Concrete Mixer",
    "DG Set / Generator Fuel",
    "Dump / Tipper Truck",
    "Hydraulic Crane Rental",
  ],
  "Equipment Hire": [
    "Scaffolding Hire",
    "Centrifugal Pump Hire",
    "Compactor / Roller Hire",
    "Bar Bender & Cutting Machine",
    "Ladder / Platform Hire",
  ],
  "Site Overheads": [
    "Site Electricity — DG Fuel",
    "Drinking Water",
    "Site Cleaning & Debris",
    "Security Fencing / Barricading",
    "Safety — Helmets, Nets, Harness",
    "Stationery & Printing",
    "Photocopy / Blue Print",
    "Site Camp & Accommodation",
    "Communication",
    "Miscellaneous",
  ],
  "Professional Fees": [
    "Architect / Design Fee",
    "Structural Engineer Certification",
    "Survey & Land Measurement",
    "Testing — Cube & Soil Test",
    "Statutory / Municipal Fee",
    "Insurance",
  ],
};

export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Cheque",
  "UPI",
  "Card",
  "Petty Cash",
] as const;

export const APPROVAL_STATUSES = ["Approved", "Pending Approval", "Rejected"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const REMITTANCE_METHODS = ["NEFT/RTGS", "Wire Transfer", "Cheque", "Demand Draft"] as const;

/* ------------------------------------------------------------------ */
/* Entities                                                            */
/* ------------------------------------------------------------------ */

export interface Site {
  id: string;
  name: string;
  country: string;
  state?: string;
  currency: "INR" | "USD";
  /** USD per 1 USD, or INR per 1 INR. Used to derive group-level INR totals. */
  exchangeRate: number;
  clientName: string;
  projectCode: string;
  /** Contract value in site currency — the denominator for budget-vs-actual. */
  contractValue: number;
  /**
   * Cash in hand / site bank at the start of the data window, in site currency.
   * This is carried-forward cash, NOT a Head Office remittance, and the ledger
   * shows it as a distinct OPENING row so it never inflates "funds received".
   */
  openingBalance: number;
  siteManager: string;
  startedOn: string;
  /** Share of contract value expected to be spent by period end, 0-1. */
  plannedSpendRatio: number;
}

export interface SiteProject {
  id: string;
  siteId: string;
  name: string;
  code: string;
  scope: string;
  /** Allocated budget in site currency. Expense budgets roll up from these. */
  budget: number;
}

export interface SiteExpense {
  id: string;
  siteId: string;
  projectId: string;
  date: string;
  group: CostGroup;
  head: string;
  description: string;
  /** Party paid: subcontractor name, material supplier, or "Site Cash". */
  paidTo: string;
  amount: number;
  currency: "INR" | "USD";
  paymentMethod: string;
  paidBy: string;
  status: ApprovalStatus;
  approvedBy?: string;
  approvedOn?: string;
  receiptNo?: string;
  /** Construction-specific supporting document: bill, lorry receipt, muster roll. */
  document?: string;
  notes: string;
}

export interface SiteRemittance {
  id: string;
  siteId: string;
  date: string;
  /** Amount in the site's own currency. */
  amount: number;
  currency: "INR" | "USD";
  method: string;
  reference: string;
  remittedBy: string;
  notes: string;
  document?: string;
}

/* ------------------------------------------------------------------ */
/* Derived ledger                                                      */
/* ------------------------------------------------------------------ */

export type LedgerKind = "OPENING" | "REMITTANCE" | "EXPENSE";

export interface LedgerRow {
  id: string;
  kind: LedgerKind;
  date: string;
  /** Signed effect on site cash: remittances add, expenses subtract. */
  inflow: number;
  outflow: number;
  balance: number;
  reference: string;
  narration: string;
  currency: "INR" | "USD";
  /** Set on expense rows only. */
  expense?: SiteExpense;
  remittance?: SiteRemittance;
}

/**
 * Build the site ledger in date order with a true running balance.
 *
 * The opening balance is emitted as its own OPENING row rather than being
 * folded into fund receipts, because it is carried-forward cash, not new
 * money from Head Office. Folding it in would inflate "funds received".
 */
export function buildLedger(
  remittances: SiteRemittance[],
  expenses: SiteExpense[],
  openingBalance: number,
  currency: "INR" | "USD"
): LedgerRow[] {
  const rows: Array<Omit<LedgerRow, "balance">> = [
    {
      id: "opening",
      kind: "OPENING",
      date: "",
      inflow: openingBalance,
      outflow: 0,
      reference: "OPENING",
      narration: "Opening balance carried forward",
      currency,
    },
    ...remittances.map((r) => ({
      id: r.id,
      kind: "REMITTANCE" as const,
      date: r.date,
      inflow: r.amount,
      outflow: 0,
      reference: r.reference,
      narration: `Funds remitted — ${r.method}`,
      currency: r.currency,
      remittance: r,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      kind: "EXPENSE" as const,
      date: e.date,
      inflow: 0,
      outflow: e.amount,
      reference: e.receiptNo ?? e.id.toUpperCase(),
      narration: `${e.group} · ${e.head}`,
      currency: e.currency,
      expense: e,
    })),
  ];

  // Stable sort by date; the opening row always stays first.
  rows.sort((a, b) => {
    if (a.date === "") return -1;
    if (b.date === "") return 1;
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    // Within a day, receipts land before payments.
    if (a.kind !== b.kind) {
      const order: Record<LedgerKind, number> = { OPENING: 0, REMITTANCE: 1, EXPENSE: 2 };
      return order[a.kind] - order[b.kind];
    }
    return 0;
  });

  let running = 0;
  return rows.map((row) => {
    running += row.inflow - row.outflow;
    return { ...row, balance: running };
  });
}

export interface SiteTotals {
  currency: "INR" | "USD";
  /** Cash remitted by HO this period. Excludes the opening balance. */
  fundsReceived: number;
  openingBalance: number;
  /** Approved + Pending + Rejected: every booked cost, for cash reality. */
  totalExpenses: number;
  approvedExpenses: number;
  pendingExpenses: number;
  rejectedExpenses: number;
  closingBalance: number;
  inrValue: number;
  utilisation: number;
}

export function computeTotals(
  site: Site,
  remittances: SiteRemittance[],
  expenses: SiteExpense[]
): SiteTotals {
  const fundsReceived = remittances.reduce((s, r) => s + r.amount, 0);
  const sumBy = (status: ApprovalStatus) =>
    expenses.filter((e) => e.status === status).reduce((s, e) => s + e.amount, 0);

  const approvedExpenses = sumBy("Approved");
  const pendingExpenses = sumBy("Pending Approval");
  const rejectedExpenses = sumBy("Rejected");
  const totalExpenses = approvedExpenses + pendingExpenses + rejectedExpenses;
  const closingBalance = site.openingBalance + fundsReceived - totalExpenses;
  const totalCash = site.openingBalance + fundsReceived;

  return {
    currency: site.currency,
    fundsReceived,
    openingBalance: site.openingBalance,
    totalExpenses,
    approvedExpenses,
    pendingExpenses,
    rejectedExpenses,
    closingBalance,
    inrValue: site.currency === "INR" ? closingBalance : closingBalance * site.exchangeRate,
    utilisation: totalCash === 0 ? 0 : Math.round((totalExpenses / totalCash) * 100),
  };
}

/* ------------------------------------------------------------------ */
/* Grouping helpers for reports                                        */
/* ------------------------------------------------------------------ */

export interface GroupTotal {
  group: CostGroup;
  amount: number;
  share: number;
  count: number;
}

export function totalsByGroup(expenses: SiteExpense[]): GroupTotal[] {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return COST_GROUPS.map((group) => {
    const rows = expenses.filter((e) => e.group === group);
    return {
      group,
      amount: rows.reduce((s, e) => s + e.amount, 0),
      share: formatPercent(
        rows.reduce((s, e) => s + e.amount, 0),
        total
      ),
      count: rows.length,
    };
  })
    .filter((g) => g.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function totalsByProject(expenses: SiteExpense[], projects: SiteProject[]) {
  return projects
    .map((p) => {
      const rows = expenses.filter((e) => e.projectId === p.id);
      const spent = rows.reduce((s, e) => s + e.amount, 0);
      return {
        project: p,
        spent,
        budget: p.budget,
        variance: p.budget - spent,
        used: formatPercent(spent, p.budget),
        rows,
      };
    })
    .filter((p) => p.spent > 0 || p.budget > 0)
    .sort((a, b) => b.spent - a.spent);
}

export function totalsByMonth(expenses: SiteExpense[]) {
  const map = new Map<string, { month: string; label: string; amount: number }>();
  for (const e of expenses) {
    const key = e.date.slice(0, 7);
    const cur = map.get(key) ?? { month: key, label: monthLabel(key), amount: 0 };
    cur.amount += e.amount;
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => (a.month < b.month ? -1 : 1));
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES[Number(m) - 1]} ${y}`;
}

export function formatSite(amount: number, currency: "INR" | "USD"): string {
  return formatMoney(amount, currency);
}

/** Display a site-currency amount, optionally annotated with its INR value. */
export function formatWithINR(
  amount: number,
  currency: "INR" | "USD",
  exchangeRate: number
): string {
  if (currency === "INR") return formatINR(amount);
  return `${formatMoney(amount, "USD")}  ·  ${formatINR(amount * exchangeRate)}`;
}
