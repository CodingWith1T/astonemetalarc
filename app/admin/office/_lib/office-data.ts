export const Office = {
  id: "ghaziabad",
  name: "Astone Metal Arc — Ghaziabad Office",
  shortName: "Ghaziabad Office",
  line: "Ghaziabad, Uttar Pradesh, India",
  banner: "OFFICE — Ghaziabad, Uttar Pradesh, India",
  currency: "INR",
  symbol: "₹",
  month: "September 2026",
  periodFrom: "2026-09-01",
  periodTo: "2026-09-30",
  openingBalance: 50000,
} as const;

export const OFFICE = Office;

export type PaymentMethod = "Bank Transfer" | "Cash" | "Cheque" | "UPI" | "Card" | "Other";

export type ExpenseStatus =
  | "Draft"
  | "Submitted"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Paid";

export type RequestStatus =
  | "Draft"
  | "Submitted"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Purchased"
  | "Completed";

export type AssetStatus =
  | "Active"
  | "Assigned"
  | "In Storage"
  | "Maintenance"
  | "Lost"
  | "Disposed";

export const PAYMENT_METHODS: PaymentMethod[] = [
  "Bank Transfer",
  "Cash",
  "Cheque",
  "UPI",
  "Card",
  "Other",
];

export const DEPARTMENTS = [
  "Administration",
  "HR",
  "Finance",
  "Management",
  "Sales",
  "IT",
  "Operations",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const EXPENSE_CATEGORY_GROUPS: Record<string, string[]> = {
  "Office Administration": [
    "Office Rent",
    "Electricity",
    "Water",
    "Internet",
    "Telephone",
    "Stationery",
    "Printing",
    "Office Supplies",
    "Cleaning",
    "Security",
    "Maintenance",
    "Office Furniture",
    "Office Equipment",
  ],
  Employee: [
    "Salary",
    "Salary Advance",
    "Employee Travel",
    "Employee Meals",
    "Employee Welfare",
    "Medical",
    "Training",
    "Recruitment",
    "Employee Reimbursement",
  ],
  Transportation: [
    "Fuel",
    "Taxi",
    "Local Transportation",
    "Vehicle Maintenance",
    "Vehicle Repair",
    "Parking",
    "Toll",
  ],
  Technology: [
    "Software Subscription",
    "Hosting",
    "Domain",
    "Cloud Services",
    "Computer Equipment",
    "IT Support",
    "Mobile Recharge",
  ],
  Professional: [
    "Legal Fees",
    "Accounting Fees",
    "Consultancy",
    "Government Fees",
    "Bank Charges",
  ],
  Other: ["Miscellaneous", "Emergency", "Other"],
};

export const EXPENSE_CATEGORIES = Object.values(EXPENSE_CATEGORY_GROUPS).flat();

export const EXPENSE_STATUSES: ExpenseStatus[] = [
  "Draft",
  "Submitted",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Paid",
];

export const REQUEST_TYPES = [
  "Purchase",
  "Reimbursement",
  "Advance",
  "Maintenance",
  "Travel",
  "Other",
] as const;

export const REQUEST_STATUSES: RequestStatus[] = [
  "Draft",
  "Submitted",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Purchased",
  "Completed",
];

export const ASSET_STATUSES: AssetStatus[] = [
  "Active",
  "Assigned",
  "In Storage",
  "Maintenance",
  "Lost",
  "Disposed",
];

export const STAFF = [
  "Accountant",
  "Admin Executive",
  "HR Executive",
  "IT Executive",
  "Sales Executive",
  "Office Manager",
  "Director",
] as const;

export const BANKS = [
  "HDFC Bank — Ghaziabad Branch (XXXX 4412)",
  "ICICI Bank — Ghaziabad Branch (XXXX 7781)",
  "Axis Bank — Ghaziabad Branch (XXXX 2093)",
] as const;

export const FUNDING_SOURCES = ["Head Office", "Project Collection", "Owner Injection", "Other"] as const;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface OfficeFund {
  id: string;
  reference: string;
  date: string;
  description: string;
  amount: number;
  source: string;
  paymentMethod: PaymentMethod;
  bank: string;
  addedBy: string;
  status: "Credited";
  notes: string;
  attachment: string;
}

export interface OfficeExpense {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  department: Department;
  amount: number;
  status: ExpenseStatus;
  paymentMethod: PaymentMethod;
  paidBy: string;
  vendor: string;
  receipt: string;
  notes: string;
}

export interface PettyCashEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  cashIn: number;
  cashOut: number;
  addedBy: string;
  reference: string;
}

export interface OfficeRequest {
  id: string;
  date: string;
  requestedBy: string;
  department: Department;
  requestType: (typeof REQUEST_TYPES)[number];
  item: string;
  quantity: number;
  estimatedAmount: number;
  reason: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  status: RequestStatus;
  attachment: string;
}

export interface VendorTransaction {
  date: string;
  reference: string;
  description: string;
  amount: number;
  mode: PaymentMethod;
}

export interface OfficeVendor {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  gstNumber: string;
  status: "Active" | "Inactive";
  transactions: VendorTransaction[];
}

export interface OfficeAsset {
  id: string;
  assetId: string;
  name: string;
  category: string;
  assignedTo: string;
  purchaseDate: string;
  cost: number;
  vendor: string;
  serialNumber: string;
  warrantyExpiry: string;
  status: AssetStatus;
  invoice: string;
  notes: string;
}

export interface AuditEvent {
  action: string;
  dateTime: string;
  by: string;
  note: string;
  tone: "created" | "moved" | "approved" | "rejected" | "paid";
}

/* ------------------------------------------------------------------ */
/* Funds                                                               */
/* ------------------------------------------------------------------ */

export const OPENING_FUNDS: OfficeFund[] = [
  {
    id: "F-000",
    reference: "OPENING",
    date: "2026-09-01",
    description: "Opening Balance (carried forward from August)",
    amount: OFFICE.openingBalance,
    source: "Carried Forward",
    paymentMethod: "Bank Transfer",
    bank: BANKS[0],
    addedBy: "Accountant",
    status: "Credited",
    notes: "Previous office balance — not a new fund receipt.",
    attachment: "",
  },
];

export const INITIAL_FUNDS: OfficeFund[] = [
  {
    id: "F-001",
    reference: "OF-001",
    date: "2026-09-01",
    description: "Monthly Office Funding",
    amount: 300000,
    source: "Head Office",
    paymentMethod: "Bank Transfer",
    bank: BANKS[0],
    addedBy: "Accountant",
    status: "Credited",
    notes: "September month-start allocation from Head Office.",
    attachment: "bank-credit-note.pdf",
  },
  {
    id: "F-002",
    reference: "OF-002",
    date: "2026-09-10",
    description: "Additional Funding",
    amount: 250000,
    source: "Head Office",
    paymentMethod: "Bank Transfer",
    bank: BANKS[0],
    addedBy: "Accountant",
    status: "Credited",
    notes: "Released against pending vendor bills.",
    attachment: "bank-credit-note-2.pdf",
  },
  {
    id: "F-003",
    reference: "OF-003",
    date: "2026-09-20",
    description: "Office Funding",
    amount: 300000,
    source: "Project Collection",
    paymentMethod: "Bank Transfer",
    bank: BANKS[1],
    addedBy: "Director",
    status: "Credited",
    notes: "Transferred from Buchanan project collection account.",
    attachment: "neft-receipt.pdf",
  },
];

/* ------------------------------------------------------------------ */
/* Expenses — 48 entries, 6,72,500 total (5,95,000 approved + 77,500) */
/* ------------------------------------------------------------------ */

const e = (
  id: string,
  date: string,
  category: string,
  subcategory: string,
  description: string,
  department: Department,
  amount: number,
  status: ExpenseStatus,
  paymentMethod: PaymentMethod,
  paidBy: string,
  vendor: string,
  notes: string,
  receipt = ""
): OfficeExpense => ({
  id,
  date,
  category,
  subcategory,
  description,
  department,
  amount,
  status,
  paymentMethod,
  paidBy,
  vendor,
  notes,
  receipt,
});

export const INITIAL_EXPENSES: OfficeExpense[] = [
  /* Salaries — 3,50,000 */
  e("EXP-1001", "2026-09-01", "Employee", "Salary", "Salary — Office Manager", "Management", 62000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),
  e("EXP-1002", "2026-09-01", "Employee", "Salary", "Salary — Accounts Executive", "Finance", 55000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),
  e("EXP-1003", "2026-09-01", "Employee", "Salary", "Salary — Admin Executive", "Administration", 48000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),
  e("EXP-1004", "2026-09-01", "Employee", "Salary", "Salary — HR Executive", "HR", 45000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),
  e("EXP-1005", "2026-09-01", "Employee", "Salary", "Salary — Sales Executive", "Sales", 40000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),
  e("EXP-1006", "2026-09-01", "Employee", "Salary", "Salary — IT Executive", "IT", 35000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),
  e("EXP-1007", "2026-09-01", "Employee", "Salary", "Salary — Operations Coordinator", "Operations", 33000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),
  e("EXP-1008", "2026-09-01", "Employee", "Salary", "Salary — Telecaller", "Sales", 32000, "Approved", "Bank Transfer", "Accountant", "—", "September salary", "salary-slip.pdf"),

  /* Rent */
  e("EXP-1025", "2026-09-25", "Office Administration", "Office Rent", "Office Rent", "Administration", 45000, "Approved", "Bank Transfer", "Accountant", "ABC Properties", "Rent for September 2026 — Ghaziabad office", "rent-invoice.pdf"),

  /* Utilities & administration */
  e("EXP-1023", "2026-09-23", "Office Administration", "Electricity", "Electricity Bill", "Administration", 8200, "Approved", "Bank Transfer", "Accountant", "UPSEB", "Commercial meter reading", "electricity-bill.pdf"),
  e("EXP-1013", "2026-09-16", "Office Administration", "Maintenance", "AC & Electrical Maintenance", "Administration", 15000, "Approved", "Cash", "Admin Executive", "CoolCare Services", "Quarterly servicing — 6 AC units", "service-invoice.pdf"),
  e("EXP-1019", "2026-09-15", "Office Administration", "Printing", "Photocopy & Printing", "Administration", 5000, "Approved", "Cash", "Admin Executive", "Sharp Print Solutions", "Tender document printing", "bill.pdf"),
  e("EXP-1020", "2026-09-14", "Office Administration", "Telephone", "Landline Telephone Bill", "Administration", 4300, "Approved", "UPI", "Admin Executive", "Airtel Business", "Landline monthly bill", "telecom-bill.pdf"),
  e("EXP-1017", "2026-09-19", "Office Administration", "Cleaning", "Office Cleaning Contract", "Administration", 8000, "Approved", "Bank Transfer", "Admin Executive", "Sparkle Facility", "Monthly deep cleaning — Sep", "contract-bill.pdf"),
  e("EXP-1018", "2026-09-19", "Office Administration", "Security", "Night Security Guard", "Administration", 7000, "Approved", "Cash", "Admin Executive", "SecureGuard Services", "Night guard wages — Sep", "attendance.pdf"),
  e("EXP-1040", "2026-09-12", "Office Administration", "Water", "Water Supply & Filtration", "Administration", 1500, "Approved", "Cash", "Admin Executive", "—", "Drinking water cans", ""),
  e("EXP-1041", "2026-09-13", "Office Administration", "Cleaning", "Daily Deep Cleaning", "Administration", 3000, "Approved", "Cash", "Admin Executive", "In-house", "In-house cleaning consumables", ""),
  e("EXP-1038", "2026-09-12", "Office Administration", "Mobile Recharge", "Staff Mobile Recharge", "Administration", 1800, "Approved", "UPI", "Admin Executive", "Airtel", "Field staff recharge", ""),
  e("EXP-1039", "2026-09-12", "Office Administration", "Office Supplies", "Cleaning & Pantry Supplies", "Administration", 3700, "Approved", "Cash", "Admin Executive", "Office Mart", "Cleaning material & pantry", "bill.pdf"),
  e("EXP-1044", "2026-09-21", "Office Administration", "Office Supplies", "Printer Toner & Cartridges", "Administration", 5000, "Approved", "Cash", "Admin Executive", "Office Mart", "Toner and cartridges", "bill.pdf"),
  e("EXP-1045", "2026-09-22", "Office Administration", "Maintenance", "Deep Cleaning & Pest Control", "Administration", 6000, "Approved", "Cash", "Admin Executive", "PestShield India", "Quarterly pest control", "bill.pdf"),
  e("EXP-1016", "2026-09-18", "Other", "Miscellaneous", "Miscellaneous Office Expense", "Administration", 12000, "Approved", "Cash", "Admin Executive", "—", "Courier, pantry and sundry items", ""),

  /* Travel */
  e("EXP-1021", "2026-09-20", "Employee", "Employee Travel", "Client Meeting", "Management", 5500, "Approved", "Cash", "Admin Executive", "—", "Client visit — Delhi", ""),

  /* Transportation */
  e("EXP-1015", "2026-09-17", "Transportation", "Fuel", "Office Vehicle Fuel", "Operations", 12500, "Approved", "Cash", "Admin Executive", "HP Fuel Pump", "Office vehicle — monthly fuel", "fuel-receipt.jpg"),
  e("EXP-1042", "2026-09-13", "Transportation", "Fuel", "Office Vehicle Fuel — Top-up", "Operations", 1850, "Approved", "Cash", "Admin Executive", "HP Fuel Pump", "Top-up", ""),
  e("EXP-1043", "2026-09-14", "Transportation", "Vehicle Maintenance", "Vehicle Servicing", "Operations", 2600, "Approved", "Cash", "Admin Executive", "Car Care Point", "Scheduled service", "service-invoice.pdf"),

  /* Technology */
  e("EXP-1024", "2026-09-24", "Office Administration", "Internet", "Monthly Internet", "IT", 2500, "Approved", "UPI", "IT Executive", "XYZ Internet", "Broadband 500 Mbps — Sep", "broadband-bill.pdf"),
  e("EXP-1009", "2026-09-05", "Technology", "Software Subscription", "Tally & Accounting Software", "Finance", 12000, "Approved", "Bank Transfer", "Accountant", "Shriram Software", "Annual Tally Prime + 3 users", "invoice.pdf"),
  e("EXP-1010", "2026-09-05", "Technology", "Software Subscription", "AutoCAD Design Suite", "IT", 7000, "Approved", "Card", "IT Executive", "Autodesk Reseller", "2 seats — drawing & estimation", "invoice.pdf"),
  e("EXP-1011", "2026-09-06", "Technology", "Hosting", "Website & Cloud Hosting", "IT", 6000, "Approved", "Card", "IT Executive", "Hostinger", "Shared hosting + business email", "invoice.pdf"),
  e("EXP-1012", "2026-09-06", "Technology", "Domain", "Domain Renewal", "IT", 2400, "Approved", "Card", "IT Executive", "GoDaddy", "astonemetalarc.com — 1 year", "invoice.pdf"),

  /* Professional */
  e("EXP-1030", "2026-09-08", "Professional", "Legal Fees", "Legal Advisory — Contracts", "Finance", 15500, "Approved", "Bank Transfer", "Director", "LegalKart LLP", "Vendor & tender contract review", "invoice.pdf"),
  e("EXP-1031", "2026-09-08", "Professional", "Accounting Fees", "Monthly Accounting Support", "Finance", 12500, "Approved", "Bank Transfer", "Director", "Gupta & Associates", "Monthly bookkeeping", "invoice.pdf"),
  e("EXP-1032", "2026-09-09", "Professional", "Government Fees", "GST & Statutory Fees", "Finance", 8000, "Approved", "Bank Transfer", "Accountant", "—", "GST returns & TDS", ""),
  e("EXP-1033", "2026-09-09", "Professional", "Bank Charges", "Bank Charges & TDS", "Finance", 3100, "Approved", "Bank Transfer", "Accountant", "HDFC Bank", "Transfer & cash handling charges", "statement.pdf"),

  /* Employee costs */
  e("EXP-1034", "2026-09-10", "Employee", "Employee Meals", "Staff Meals", "HR", 6400, "Approved", "Cash", "HR Executive", "—", "Office pantry — staff", ""),
  e("EXP-1054", "2026-09-10", "Employee", "Employee Meals", "Guest & Visitor Meals", "Administration", 3200, "Approved", "Cash", "HR Executive", "—", "Client & visitor refreshments", ""),
  e("EXP-1035", "2026-09-10", "Employee", "Medical", "Employee Health Checkup", "HR", 5700, "Approved", "Cash", "HR Executive", "Apollo Diagnostics", "Annual health check — 14 staff", "invoice.pdf"),
  e("EXP-1036", "2026-09-11", "Employee", "Training", "Safety & Software Training", "HR", 7000, "Approved", "Bank Transfer", "HR Executive", "NIIT Learning", "Site safety induction", "invoice.pdf"),
  e("EXP-1037", "2026-09-11", "Employee", "Employee Reimbursement", "Employee Travel Reimbursement", "Sales", 5750, "Approved", "Cash", "Sales Executive", "—", "Conveyance claims — Sep", "claim-sheet.pdf"),

  /* ---- Pending (77,500) ---- */
  e("EXP-1022", "2026-09-22", "Office Administration", "Stationery", "Office Supplies", "Administration", 3400, "Pending Approval", "Cash", "Admin Executive", "Office Mart", "Awaiting manager approval", "bill.jpg"),
  e("EXP-1026", "2026-09-19", "Technology", "Computer Equipment", "Laptop for New Hire", "IT", 32400, "Pending Approval", "Bank Transfer", "IT Executive", "Vertex IT Services", "Quotation under review", "quotation.pdf"),
  e("EXP-1027", "2026-09-17", "Employee", "Salary Advance", "Employee Advance — Purchase", "HR", 12000, "Pending Approval", "Bank Transfer", "HR Executive", "—", "Advance against festival expenses", ""),
  e("EXP-1028", "2026-09-15", "Office Administration", "Maintenance", "AC Repair — 2nd Floor", "Administration", 9200, "Pending Approval", "Cash", "Admin Executive", "CoolCare Services", "Compressor issue — quoted", "quotation.pdf"),
  e("EXP-1029", "2026-09-20", "Employee", "Employee Travel", "Travel Advance — Site Visit", "Operations", 8500, "Pending Approval", "Cash", "Admin Executive", "—", "Advance for Aligarh site visit", ""),
  e("EXP-1051", "2026-09-18", "Office Administration", "Printing", "Bulk Printing — Tender Documents", "Administration", 6000, "Pending Approval", "Bank Transfer", "Admin Executive", "Sharp Print Solutions", "300 sets of tender documents", "quotation.pdf"),
  e("EXP-1052", "2026-09-16", "Technology", "Software Subscription", "Design Software Renewal", "IT", 3500, "Pending Approval", "Card", "IT Executive", "Autodesk Reseller", "Subscription renewal", "invoice.pdf"),
  e("EXP-1053", "2026-09-11", "Employee", "Medical", "Employee Medical Claim", "HR", 2500, "Pending Approval", "Cash", "HR Executive", "Apollo Diagnostics", "Medical reimbursement claim", "claim.pdf"),
];

/* ------------------------------------------------------------------ */
/* Petty cash                                                          */
/* ------------------------------------------------------------------ */

export const OPENING_PETTY_CASH: PettyCashEntry[] = [
  {
    id: "PC-000",
    date: "2026-09-01",
    description: "Opening Float",
    category: "Opening",
    cashIn: 20000,
    cashOut: 0,
    addedBy: "Accountant",
    reference: "PC-OPEN",
  },
];

export const INITIAL_PETTY_CASH: PettyCashEntry[] = [
  { id: "PC-001", date: "2026-09-02", description: "Petty Cash Voucher — Stationery", category: "Stationery", cashIn: 0, cashOut: 2450, addedBy: "Admin Executive", reference: "PV-0141" },
  { id: "PC-002", date: "2026-09-04", description: "Postage & Courier", category: "Office Supplies", cashIn: 0, cashOut: 860, addedBy: "Admin Executive", reference: "PV-0142" },
  { id: "PC-003", date: "2026-09-06", description: "Tea & Refreshments — Site Visit", category: "Other", cashIn: 0, cashOut: 1320, addedBy: "Admin Executive", reference: "PV-0143" },
  { id: "PC-004", date: "2026-09-08", description: "Office Water Cans", category: "Office Supplies", cashIn: 0, cashOut: 640, addedBy: "Admin Executive", reference: "PV-0144" },
  { id: "PC-005", date: "2026-09-09", description: "Petty Cash Top-up", category: "Cash Added", cashIn: 15000, cashOut: 0, addedBy: "Accountant", reference: "PV-0145" },
  { id: "PC-006", date: "2026-09-11", description: "Local Taxi — Bank Submission", category: "Local Transportation", cashIn: 0, cashOut: 780, addedBy: "Admin Executive", reference: "PV-0146" },
  { id: "PC-007", date: "2026-09-13", description: "First Aid & Safety Items", category: "Office Supplies", cashIn: 0, cashOut: 1750, addedBy: "Admin Executive", reference: "PV-0147" },
  { id: "PC-008", date: "2026-09-15", description: "Guest Parking & Toll", category: "Toll", cashIn: 0, cashOut: 620, addedBy: "Admin Executive", reference: "PV-0148" },
  { id: "PC-009", date: "2026-09-17", description: "Office Cleaning Consumables", category: "Cleaning", cashIn: 0, cashOut: 2130, addedBy: "Admin Executive", reference: "PV-0149" },
  { id: "PC-010", date: "2026-09-19", description: "Petty Cash Top-up", category: "Cash Added", cashIn: 15000, cashOut: 0, addedBy: "Accountant", reference: "PV-0150" },
  { id: "PC-011", date: "2026-09-21", description: "Photocopy & Lamination", category: "Printing", cashIn: 0, cashOut: 740, addedBy: "Admin Executive", reference: "PV-0151" },
  { id: "PC-012", date: "2026-09-23", description: "Pantry Restock", category: "Other", cashIn: 0, cashOut: 4160, addedBy: "Admin Executive", reference: "PV-0152" },
  { id: "PC-013", date: "2026-09-25", description: "Emergency Electrical Repair", category: "Maintenance", cashIn: 0, cashOut: 4050, addedBy: "Admin Executive", reference: "PV-0153" },
];

/* ------------------------------------------------------------------ */
/* Requests                                                            */
/* ------------------------------------------------------------------ */

export const INITIAL_REQUESTS: OfficeRequest[] = [
  { id: "REQ-001", date: "2026-09-02", requestedBy: "Admin Executive", department: "Administration", requestType: "Purchase", item: "Office Chairs (4 nos)", quantity: 4, estimatedAmount: 24000, reason: "New joiners seating", priority: "Normal", status: "Purchased", attachment: "quotation.pdf" },
  { id: "REQ-002", date: "2026-09-03", requestedBy: "HR Executive", department: "HR", requestType: "Other", item: "Job Portal Subscription", quantity: 1, estimatedAmount: 12000, reason: "Hiring pipeline for Q4", priority: "High", status: "Completed", attachment: "" },
  { id: "REQ-003", date: "2026-09-05", requestedBy: "IT Executive", department: "IT", requestType: "Purchase", item: "Network Switch — 24 Port", quantity: 1, estimatedAmount: 18500, reason: "Network expansion", priority: "High", status: "Approved", attachment: "quotation.pdf" },
  { id: "REQ-004", date: "2026-09-06", requestedBy: "Admin Executive", department: "Administration", requestType: "Maintenance", item: "Deep Cleaning Contract", quantity: 1, estimatedAmount: 96000, reason: "Annual office deep cleaning", priority: "Normal", status: "Approved", attachment: "contract.pdf" },
  { id: "REQ-005", date: "2026-09-08", requestedBy: "Sales Executive", department: "Sales", requestType: "Reimbursement", item: "Client Visit Conveyance", quantity: 6, estimatedAmount: 5750, reason: "Multiple site visits in Delhi NCR", priority: "Normal", status: "Approved", attachment: "claims.xlsx" },
  { id: "REQ-006", date: "2026-09-09", requestedBy: "Director", department: "Management", requestType: "Travel", item: "Delhi — Client Meeting Travel & Stay", quantity: 1, estimatedAmount: 14500, reason: "Steel's biggest order negotiation", priority: "Urgent", status: "Completed", attachment: "itinerary.pdf" },
  { id: "REQ-007", date: "2026-09-10", requestedBy: "HR Executive", department: "HR", requestType: "Other", item: "Diwali Celebration Supplies", quantity: 1, estimatedAmount: 28000, reason: "Staff & site celebration", priority: "High", status: "Pending Approval", attachment: "proposal.pdf" },
  { id: "REQ-008", date: "2026-09-11", requestedBy: "Accountant", department: "Finance", requestType: "Purchase", item: "Barcode Scanner & Printer", quantity: 2, estimatedAmount: 16500, reason: "Petty cash voucher tracking", priority: "Normal", status: "Pending Approval", attachment: "quotation.pdf" },
  { id: "REQ-009", date: "2026-09-12", requestedBy: "IT Executive", department: "IT", requestType: "Purchase", item: "Antivirus Licences — 25 Users", quantity: 25, estimatedAmount: 22500, reason: "Annual renewal", priority: "High", status: "Pending Approval", attachment: "quotation.pdf" },
  { id: "REQ-010", date: "2026-09-12", requestedBy: "Admin Executive", department: "Administration", requestType: "Purchase", item: "Water Dispenser", quantity: 1, estimatedAmount: 9800, reason: "Existing unit unserviceable", priority: "Low", status: "Approved", attachment: "" },
  { id: "REQ-011", date: "2026-09-14", requestedBy: "Operations Coordinator", department: "Operations", requestType: "Advance", item: "Petrol Advance — Office Vehicle", quantity: 1, estimatedAmount: 5000, reason: "Monthly fuel cash advance", priority: "Normal", status: "Approved", attachment: "" },
  { id: "REQ-012", date: "2026-09-15", requestedBy: "HR Executive", department: "HR", requestType: "Reimbursement", item: "Medical Claim — Employee", quantity: 1, estimatedAmount: 2500, reason: "Outpatient treatment", priority: "Normal", status: "Pending Approval", attachment: "medical-claim.pdf" },
  { id: "REQ-013", date: "2026-09-16", requestedBy: "Sales Executive", department: "Sales", requestType: "Advance", item: "Marketing Advance — Trade Show", quantity: 1, estimatedAmount: 35000, reason: "Delhi construction expo stall", priority: "High", status: "Pending Approval", attachment: "proposal.pdf" },
  { id: "REQ-014", date: "2026-09-17", requestedBy: "Admin Executive", department: "Administration", requestType: "Maintenance", item: "AC Gas Refilling — 4 Units", quantity: 4, estimatedAmount: 7400, reason: "Quarterly refill", priority: "Normal", status: "Pending Approval", attachment: "quotation.pdf" },
  { id: "REQ-015", date: "2026-09-18", requestedBy: "IT Executive", department: "IT", requestType: "Reimbursement", item: "Broadband Installation Charge", quantity: 1, estimatedAmount: 2500, reason: "Router upgrade", priority: "Low", status: "Pending Approval", attachment: "bill.jpg" },
  { id: "REQ-016", date: "2026-09-19", requestedBy: "Accountant", department: "Finance", requestType: "Other", item: "Stationery Register & Files", quantity: 20, estimatedAmount: 3400, reason: "Records management", priority: "Low", status: "Pending Approval", attachment: "" },
  { id: "REQ-017", date: "2026-09-21", requestedBy: "Director", department: "Management", requestType: "Purchase", item: "Corporate Office Name Board", quantity: 1, estimatedAmount: 18500, reason: "Ghaziabad office branding", priority: "Normal", status: "Draft", attachment: "design.pdf" },
  { id: "REQ-018", date: "2026-09-22", requestedBy: "HR Executive", department: "HR", requestType: "Other", item: "Welder Safety Certification", quantity: 6, estimatedAmount: 21000, reason: "Site compliance", priority: "High", status: "Submitted", attachment: "scope.pdf" },
  { id: "REQ-019", date: "2026-09-23", requestedBy: "Admin Executive", department: "Administration", requestType: "Purchase", item: "Visitor Management Software", quantity: 1, estimatedAmount: 30000, reason: "Security compliance", priority: "Normal", status: "Submitted", attachment: "quotation.pdf" },
  { id: "REQ-020", date: "2026-09-24", requestedBy: "Sales Executive", department: "Sales", requestType: "Reimbursement", item: "Sample Courier Charges", quantity: 8, estimatedAmount: 3200, reason: "Steel sample dispatch", priority: "Normal", status: "Rejected", attachment: "claims.xlsx" },
];

/* ------------------------------------------------------------------ */
/* Vendors                                                             */
/* ------------------------------------------------------------------ */

export const INITIAL_VENDORS: OfficeVendor[] = [
  {
    id: "VEN-001",
    name: "ABC Properties",
    category: "Rent & Property",
    contactPerson: "Rajesh Kumar",
    phone: "+91 98 1122 3344",
    email: "rent@abcproperties.in",
    address: "14, Civil Lines, Ghaziabad, Uttar Pradesh",
    paymentTerms: "Net 15 from invoice date",
    gstNumber: "09AABCA1234M1Z5",
    status: "Active",
    transactions: [
      { date: "2026-09-25", reference: "EXP-1025", description: "Office Rent — September 2026", amount: 45000, mode: "Bank Transfer" },
      { date: "2026-08-25", reference: "EXP-0902", description: "Office Rent — August 2026", amount: 45000, mode: "Bank Transfer" },
      { date: "2026-07-25", reference: "EXP-0781", description: "Office Rent — July 2026", amount: 45000, mode: "Bank Transfer" },
    ],
  },
  {
    id: "VEN-002",
    name: "XYZ Internet",
    category: "Internet & Telecom",
    contactPerson: "Neha Saxena",
    phone: "+91 99 8877 6655",
    email: "support@xyzinternet.in",
    address: "Sector 18, Noida, Uttar Pradesh",
    paymentTerms: "Monthly, due within 7 days",
    gstNumber: "09AABCX5566P1ZQ",
    status: "Active",
    transactions: [
      { date: "2026-09-24", reference: "EXP-1024", description: "Broadband 500 Mbps — September", amount: 2500, mode: "UPI" },
      { date: "2026-08-24", reference: "EXP-0901", description: "Broadband 500 Mbps — August", amount: 2500, mode: "UPI" },
    ],
  },
  {
    id: "VEN-003",
    name: "Office Mart",
    category: "Stationery & Supplies",
    contactPerson: "Anil Grover",
    phone: "+91 97 5544 3322",
    email: "sales@officemart.co.in",
    address: "Nehru Place Market, Delhi",
    paymentTerms: "On delivery",
    gstNumber: "07AAECO7788L1ZR",
    status: "Active",
    transactions: [
      { date: "2026-09-22", reference: "EXP-1022", description: "Office supplies — pending approval", amount: 3400, mode: "Cash" },
      { date: "2026-09-21", reference: "EXP-1044", description: "Printer toner & cartridges", amount: 5000, mode: "Cash" },
      { date: "2026-09-12", reference: "EXP-1039", description: "Cleaning & pantry supplies", amount: 3700, mode: "Cash" },
      { date: "2026-08-21", reference: "EXP-0898", description: "Office supplies — August", amount: 4600, mode: "Cash" },
    ],
  },
  {
    id: "VEN-004",
    name: "Sharp Print Solutions",
    category: "Printing",
    contactPerson: "Preeti Nair",
    phone: "+91 88 2200 9911",
    email: "hello@sharpprint.in",
    address: "Saharanpur Road, Ghaziabad",
    paymentTerms: "Net 7",
    gstNumber: "09AAGCS4455M1ZK",
    status: "Active",
    transactions: [
      { date: "2026-09-18", reference: "EXP-1051", description: "Bulk tender printing — pending", amount: 6000, mode: "Bank Transfer" },
      { date: "2026-09-15", reference: "EXP-1019", description: "Photocopy & printing", amount: 5000, mode: "Cash" },
    ],
  },
  {
    id: "VEN-005",
    name: "CoolCare Services",
    category: "Maintenance & HVAC",
    contactPerson: "Sandeep Rawat",
    phone: "+91 90 5566 7788",
    email: "service@coolcare.in",
    address: "Indrapuri, Ghaziabad",
    paymentTerms: "On service completion",
    gstNumber: "09AAGCC9012N1ZB",
    status: "Active",
    transactions: [
      { date: "2026-09-16", reference: "EXP-1013", description: "Quarterly AC servicing — 6 units", amount: 15000, mode: "Cash" },
      { date: "2026-09-15", reference: "EXP-1028", description: "AC repair 2nd floor — pending", amount: 9200, mode: "Cash" },
    ],
  },
  {
    id: "VEN-006",
    name: "Vertex IT Services",
    category: "IT Hardware & Software",
    contactPerson: "Karan Mehra",
    phone: "+91 91 3322 1100",
    email: "sales@vertexit.in",
    address: "Sector 62, Noida, Uttar Pradesh",
    paymentTerms: "Net 30",
    gstNumber: "09AABCV3322K1ZP",
    status: "Active",
    transactions: [
      { date: "2026-09-19", reference: "EXP-1026", description: "Laptop for new hire — pending", amount: 32400, mode: "Bank Transfer" },
      { date: "2026-06-11", reference: "EXP-0612", description: "Desktop for design dept", amount: 46000, mode: "Bank Transfer" },
    ],
  },
  {
    id: "VEN-007",
    name: "Gupta & Associates",
    category: "Professional — Accounting",
    contactPerson: "Sunil Gupta",
    phone: "+91 11 4000 2200",
    email: "accounts@guptaassociates.in",
    address: "Connaught Place, New Delhi",
    paymentTerms: "Net 15",
    gstNumber: "07AAEFG5566T1ZH",
    status: "Active",
    transactions: [
      { date: "2026-09-08", reference: "EXP-1031", description: "Monthly accounting support — September", amount: 12500, mode: "Bank Transfer" },
      { date: "2026-08-08", reference: "EXP-0887", description: "Monthly accounting support — August", amount: 12500, mode: "Bank Transfer" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

export const INITIAL_ASSETS: OfficeAsset[] = [
  { id: "A-001", assetId: "AST-001", name: "MacBook Pro 14\"", category: "IT", assignedTo: "IT Executive", purchaseDate: "2025-11-18", cost: 150000, vendor: "Vertex IT Services", serialNumber: "MBP14-X9K2L", warrantyExpiry: "2028-11-17", status: "Assigned", invoice: "INV-VX-2211", notes: "Design & estimation workstation" },
  { id: "A-002", assetId: "AST-002", name: "HP LaserJet Printer", category: "Equipment", assignedTo: "Admin Executive", purchaseDate: "2025-06-04", cost: 25000, vendor: "Office Mart", serialNumber: "HP-LJ-77219", warrantyExpiry: "2027-06-03", status: "Active", invoice: "INV-OM-1180", notes: "Shared office printer" },
  { id: "A-003", assetId: "AST-003", name: "Executive Office Desk", category: "Furniture", assignedTo: "—", purchaseDate: "2024-02-12", cost: 12000, vendor: "ABC Properties", serialNumber: "FURN-0442", warrantyExpiry: "—", status: "Active", invoice: "INV-AB-0912", notes: "Director cabin" },
  { id: "A-004", assetId: "AST-004", name: "Split AC 1.5 Ton", category: "Equipment", assignedTo: "—", purchaseDate: "2024-07-22", cost: 45000, vendor: "CoolCare Services", serialNumber: "AC-24-7731", warrantyExpiry: "2027-07-21", status: "Maintenance", invoice: "INV-CC-3345", notes: "Servicing due — compressor issue" },
  { id: "A-005", assetId: "AST-005", name: "Waiting Area Sofa Set", category: "Furniture", assignedTo: "—", purchaseDate: "2025-03-09", cost: 48000, vendor: "Office Mart", serialNumber: "FURN-0917", warrantyExpiry: "—", status: "In Storage", invoice: "INV-OM-1244", notes: "Replacement set received, installation pending" },
  { id: "A-006", assetId: "AST-006", name: "Dell Optiplex Desktop", category: "IT", assignedTo: "Accountant", purchaseDate: "2025-09-01", cost: 58000, vendor: "Vertex IT Services", serialNumber: "DOP-88C2K", warrantyExpiry: "2027-08-31", status: "Assigned", invoice: "INV-VX-2301", notes: "Accounts workstation" },
  { id: "A-007", assetId: "AST-007", name: "Biometric Attendance Device", category: "Equipment", assignedTo: "HR Executive", purchaseDate: "2024-12-15", cost: 18500, vendor: "SecureGuard Services", serialNumber: "BIO-4417", warrantyExpiry: "2026-12-14", status: "Active", invoice: "INV-SG-0771", notes: "Attendance & visitor log" },
  { id: "A-008", assetId: "AST-008", name: "Old CRT Monitor", category: "IT", assignedTo: "—", purchaseDate: "2019-05-20", cost: 9000, vendor: "—", serialNumber: "CRT-2201", warrantyExpiry: "2021-05-19", status: "Disposed", invoice: "—", notes: "Disposed during 2026 audit" },
];

/* ------------------------------------------------------------------ */
/* Monthly analytics                                                   */
/* ------------------------------------------------------------------ */

export const MONTHLY_SPEND = [
  { month: "June", funds: 620000, expenses: 412500, balance: 209500 },
  { month: "July", funds: 680000, expenses: 488200, balance: 401300 },
  { month: "August", funds: 725000, expenses: 521700, balance: 604600 },
  { month: "September", funds: 850000, expenses: 672500, balance: 782100 },
];

/* ------------------------------------------------------------------ */
/* Formatters & helpers                                                */
/* ------------------------------------------------------------------ */

/* Currency/date formatting lives in the shared finance lib so that Office,
   Sites and Procurement all render money identically. Re-exported here for
   the many office components that already import from this module. */
import { formatDateTime } from "@/app/admin/_lib/finance/format";

export {
  formatINR,
  formatCompactINR,
  formatUSD,
  formatMoney,
  formatDate,
  formatDateShort,
  formatDateTime,
  formatPercent,
} from "@/app/admin/_lib/finance/format";

export function isPendingStatus(status: ExpenseStatus | RequestStatus): boolean {
  return status === "Pending Approval" || status === "Submitted";
}

export function buildAuditTrail(
  item: { id: string; date: string; status: string; paidBy: string },
  kind: "expense" | "fund" | "request"
): AuditEvent[] {
  const base = item.date;
  const events: AuditEvent[] = [
    {
      action: "Created",
      dateTime: formatDateTime(base, "10:15 AM"),
      by: item.paidBy,
      note: kind === "fund" ? "Funding entry created" : `${kind === "request" ? "Request" : "Expense"} #${item.id} created in draft`,
      tone: "created",
    },
    {
      action: "Submitted",
      dateTime: formatDateTime(base, "10:20 AM"),
      by: item.paidBy,
      note: "Submitted for approval",
      tone: "moved",
    },
  ];

  const s = item.status;
  if (s === "Pending Approval" || s === "Submitted" || s === "Draft") {
    if (s === "Draft") events.pop();
    return events;
  }

  events.push({
    action: "Approved",
    dateTime: formatDateTime(base, "11:05 AM"),
    by: "Admin",
    note: "Approved by office administrator",
    tone: "approved",
  });

  if (s === "Paid" || kind === "fund" || s === "Completed" || s === "Purchased") {
    events.push({
      action: kind === "fund" ? "Credited to Bank" : "Paid",
      dateTime: formatDateTime(base, "11:30 AM"),
      by: "Accountant",
      note: kind === "fund" ? "Amount credited to office bank account" : "Payment released to vendor / employee",
      tone: "paid",
    });
  }

  if (s === "Rejected") {
    events[events.length - 1] = {
      action: "Rejected",
      dateTime: formatDateTime(base, "12:10 PM"),
      by: "Admin",
      note: "Rejected — reason recorded in remarks",
      tone: "rejected",
    };
  }

  return events;
}

export function statusToneClass(status: string): string {
  return `fin-status fin-status-${status.toLowerCase().replace(/\s+/g, "-")}`;
}

export const REPORTS = [
  { id: "expense", name: "Expense Report", description: "Category-wise office expenses with department split", icon: "receipt" },
  { id: "funds", name: "Funds Report", description: "Funding received, source and closing balance", icon: "bank" },
  { id: "petty-cash", name: "Petty Cash Report", description: "Petty cash in / out with running balance", icon: "wallet" },
  { id: "department", name: "Department Report", description: "Department-wise spend and budget usage", icon: "team" },
  { id: "vendor", name: "Vendor Report", description: "Vendor-wise payment and outstanding dues", icon: "building" },
  { id: "asset", name: "Asset Report", description: "Office asset register with depreciation status", icon: "box" },
  { id: "monthly", name: "Monthly Financial Report", description: "Month-on-month funds, expenses and balance", icon: "calendar" },
];
