/**
 * Seed data for Site Finance.
 *
 * The same four live sites as the Locations module, expressed with a proper
 * construction cost structure. All figures are realistic for a mid-size
 * contractor; every total shown in the UI is derived from these rows rather
 * than asserted separately, so the pages cannot disagree with themselves.
 */

import type { Site, SiteProject, SiteExpense, SiteRemittance } from "./sites-data";

export const SITES: Site[] = [
  {
    id: "monrovia",
    name: "Monrovia",
    country: "Liberia",
    state: "Montserrado County",
    currency: "USD",
    exchangeRate: 88.5,
    clientName: "Liberia Ports Authority",
    projectCode: "LPA-ADM-2026",
    contractValue: 485000,
    openingBalance: 18500,
    siteManager: "R. K. Mensah",
    startedOn: "2026-04-12",
    plannedSpendRatio: 0.35,
  },
  {
    id: "gurgaon",
    name: "Gurgaon",
    country: "India",
    state: "Haryana",
    currency: "INR",
    exchangeRate: 1,
    clientName: "Ambience Developers Pvt Ltd",
    projectCode: "AMA-WH-2026",
    contractValue: 82000000,
    openingBalance: 1200000,
    siteManager: "S. Yadav",
    startedOn: "2026-05-03",
    plannedSpendRatio: 0.38,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    state: "Maharashtra",
    currency: "INR",
    exchangeRate: 1,
    clientName: "Jindal Logistics Ltd",
    projectCode: "AMA-IW-2026",
    contractValue: 45000000,
    openingBalance: 850000,
    siteManager: "A. Patil",
    startedOn: "2026-06-18",
    plannedSpendRatio: 0.32,
  },
  {
    id: "aligarh",
    name: "Aligarh",
    country: "India",
    state: "Uttar Pradesh",
    currency: "INR",
    exchangeRate: 1,
    clientName: "Aarogya Cold Chain Ltd",
    projectCode: "AMA-PEB-2026",
    contractValue: 22000000,
    openingBalance: 640000,
    siteManager: "M. Hussain",
    startedOn: "2026-07-25",
    plannedSpendRatio: 0.3,
  },
];

export const PROJECTS: SiteProject[] = [
  // Monrovia — Liberia, USD
  { id: "mon-p1", siteId: "monrovia", name: "Administration Building", code: "LPA-ADM-01", scope: "G+2 administration block, structural renovation and fit-out", budget: 290000 },
  { id: "mon-p2", siteId: "monrovia", name: "Warehouse Project", code: "LPA-WH-02", scope: "Pre-engineered warehouse shed with loading bay", budget: 195000 },

  // Gurgaon — India, INR
  { id: "gur-p1", siteId: "gurgaon", name: "Warehouse Complex", code: "AMA-WH-01", scope: "Four-block warehouse complex, 50,000 sq ft, RCC frame", budget: 38000000 },
  { id: "gur-p2", siteId: "gurgaon", name: "Factory Shed Phase 1", code: "AMA-FS-02", scope: "Factory shed with crane gantry, 25,000 sq ft", budget: 26000000 },
  { id: "gur-p3", siteId: "gurgaon", name: "Cold Storage Unit", code: "AMA-CS-03", scope: "Prefabricated cold storage, 15,000 sq ft", budget: 18000000 },

  // Mumbai — India, INR
  { id: "mum-p1", siteId: "mumbai", name: "Industrial Warehouse", code: "AMA-IW-01", scope: "Industrial warehouse with dock levellers, 40,000 sq ft", budget: 45000000 },

  // Aligarh — India, INR
  { id: "ali-p1", siteId: "aligarh", name: "PEB Structure", code: "AMA-PEB-01", scope: "Pre-engineered building with Mezzanine, 30,000 sq ft", budget: 22000000 },
];

let expenseSeq = 0;
let remittanceSeq = 0;

function exp(
  siteId: string,
  projectId: string,
  date: string,
  group: SiteExpense["group"],
  head: string,
  description: string,
  paidTo: string,
  amount: number,
  currency: "INR" | "USD",
  method: string,
  paidBy: string,
  status: SiteExpense["status"] = "Approved",
  extra: Partial<SiteExpense> = {}
): SiteExpense {
  expenseSeq += 1;
  return {
    id: `sx-${String(expenseSeq).padStart(4, "0")}`,
    siteId,
    projectId,
    date,
    group,
    head,
    description,
    paidTo,
    amount,
    currency,
    paymentMethod: method,
    paidBy,
    status,
    receiptNo: `RCP-${String(expenseSeq).padStart(4, "0")}`,
    notes: "",
    ...extra,
  };
}

function remit(
  siteId: string,
  date: string,
  amount: number,
  currency: "INR" | "USD",
  method: string,
  reference: string,
  remittedBy: string,
  notes: string
): SiteRemittance {
  remittanceSeq += 1;
  return {
    id: `sr-${String(remittanceSeq).padStart(4, "0")}`,
    siteId,
    date,
    amount,
    currency,
    method,
    reference,
    remittedBy,
    notes,
  };
}

/* ------------------------------------------------------------------ */
/* Monrovia — Liberia, USD                                            */
/* ------------------------------------------------------------------ */

const MONROVIA_REMITTANCES: SiteRemittance[] = [
  remit("monrovia", "2026-08-04", 120000, "USD", "Wire Transfer", "SW-88214", "Head Office — Accounts", "Phase 2 mobilisation tranche against milestone M2"),
  remit("monrovia", "2026-09-02", 95000, "USD", "Wire Transfer", "SW-88577", "Head Office — Accounts", "Monthly remittance for September works"),
];

const MONROVIA_EXPENSES: SiteExpense[] = [
  // --- September 2026 (reporting period) ---
  exp("monrovia", "mon-p1", "2026-09-04", "Material", "Cement — OPC / PPC", "OPC cement 400 bags @ $11.20", "Dharamsi Building Supplies", 4480, "USD", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-4471" }),
  exp("monrovia", "mon-p1", "2026-09-05", "Material", "Steel — TMT Bar", "TMT reinforcement bar 12mm, 18 tonnes", "Monrovia Steel Depot", 9720, "USD", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-4488" }),
  exp("monrovia", "mon-p1", "2026-09-06", "Subcontractor", "Excavation Subcontractor", "Bulk excavation for admin block footings, 340 m³", "J.K. Earthmoving Co", 6400, "USD", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-221" }),
  exp("monrovia", "mon-p1", "2026-09-08", "Labour", "Skilled Labour — Mason / Steel Fixer", "Mason gang weekly wages, 14 men × 6 days", "Site Cash", 3120, "USD", "Cash", "Site Engineer", "Approved"),
  exp("monrovia", "mon-p1", "2026-09-08", "Labour", "Unskilled Labour — Helper", "Helper gang weekly wages, 22 men × 6 days", "Site Cash", 1980, "USD", "Cash", "Site Engineer", "Approved"),
  exp("monrovia", "mon-p1", "2026-09-09", "Equipment Hire", "Scaffolding Hire", "Scaffolding tower hire — 15 days, 3 bays", "Liberia Hire Services", 2250, "USD", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-0912" }),
  exp("monrovia", "mon-p1", "2026-09-11", "Machinery", "Concrete Mixer", "Mixer hire with operator, 10 days", "Monrovia Plant Hire", 1400, "USD", "Cash", "Site Engineer", "Approved"),
  exp("monrovia", "mon-p1", "2026-09-12", "Site Overheads", "Site Electricity — DG Fuel", "Diesel for site generator — 600 litres", "Total Liberia", 1290, "USD", "Cash", "Site Engineer", "Approved", { receiptNo: "LOR-3390" }),
  exp("monrovia", "mon-p1", "2026-09-14", "Labour", "Site Supervisor Wages", "Site supervisor and storekeeper — September", "Site Cash", 1850, "USD", "Bank Transfer", "Site Manager", "Approved"),
  exp("monrovia", "mon-p2", "2026-09-15", "Material", "Structural Steel — Section", "PEB portal frame sections, 42 MT fabricated", "Astone Fabrication Unit", 21400, "USD", "Bank Transfer", "Procurement", "Approved", { receiptNo: "FAB-118" }),
  exp("monrovia", "mon-p2", "2026-09-16", "Subcontractor", "Shuttering Subcontractor", "Column and slab shuttering, 1,850 sq m", "Coast Builders Formwork", 7820, "USD", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-238" }),
  exp("monrovia", "mon-p2", "2026-09-17", "Material", "Roofing & Sheeting", "Roof sheeting 0.6mm GI, 9,400 sq m", "Monrovia Steel Depot", 15980, "USD", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-4502" }),
  exp("monrovia", "mon-p2", "2026-09-18", "Machinery", "Crane — Mobile / Tower", "Crane hire for frame erection, 8 shifts", "Liberia Hire Services", 6400, "USD", "Bank Transfer", "Site Engineer", "Pending Approval", { receiptNo: "HIR-0934" }),
  exp("monrovia", "mon-p2", "2026-09-19", "Labour", "Welder / Fabricator", "Structural welding crew wages, 9 men × 6 days", "Site Cash", 2160, "USD", "Cash", "Site Engineer", "Approved"),
  exp("monrovia", "mon-p2", "2026-09-21", "Site Overheads", "Drinking Water", "Bottled water — 240 cases", "Pure Life Monrovia", 660, "USD", "Cash", "Site Engineer", "Approved", { receiptNo: "INV-7712" }),
  exp("monrovia", "mon-p2", "2026-09-22", "Site Overheads", "Safety — Helmets, Nets, Harness", "PPE replenishment — helmets, gloves, harness", "Safety First Liberia", 890, "USD", "Cash", "Site Manager", "Approved", { receiptNo: "INV-7788" }),
  exp("monrovia", "mon-p1", "2026-09-23", "Material", "Electrical Material", "Copper wire, conduit, DB components", "Electrical Supply Co", 3150, "USD", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-4540" }),
  exp("monrovia", "mon-p1", "2026-09-25", "Subcontractor", "Waterproofing Subcontractor", "Terrace waterproofing — 900 sq m", "Liberia Waterproofing Ltd", 4300, "USD", "Bank Transfer", "Site Engineer", "Pending Approval", { receiptNo: "SUB-251" }),
  exp("monrovia", "mon-p2", "2026-09-26", "Professional Fees", "Testing — Cube & Soil Test", "Cube compression test × 15, soil test", "Liberia Testing Lab", 1250, "USD", "Bank Transfer", "Site Manager", "Approved", { receiptNo: "LAB-330" }),
  exp("monrovia", "mon-p1", "2026-09-27", "Site Overheads", "Communication", "Site internet and monthly mobile recharge", "Lonestar Communications", 180, "USD", "Cash", "Site Manager", "Approved"),
  exp("monrovia", "mon-p2", "2026-09-28", "Machinery", "Excavator / JCB", "Backhoe hire for yard levelling, 6 days", "Monrovia Plant Hire", 1950, "USD", "Cash", "Site Engineer", "Approved"),
  exp("monrovia", "mon-p1", "2026-09-29", "Material", "Finishes — Paint / Putty", "Putty, primer and emulsion for admin block", "Dharamsi Building Supplies", 1740, "USD", "Bank Transfer", "Procurement", "Pending Approval", { receiptNo: "INV-4561" }),

  // --- August 2026 (prior period, gives month-on-month comparison) ---
  exp("monrovia", "mon-p1", "2026-08-08", "Material", "Cement — OPC / PPC", "OPC cement 300 bags @ $11.00", "Dharamsi Building Supplies", 3300, "USD", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-4390" }),
  exp("monrovia", "mon-p1", "2026-08-12", "Labour", "Skilled Labour — Mason / Steel Fixer", "Mason gang weekly wages, 12 men × 6 days", "Site Cash", 2520, "USD", "Cash", "Site Engineer", "Approved"),
  exp("monrovia", "mon-p1", "2026-08-14", "Subcontractor", "Piling Subcontractor", "Piling for admin block, 18 piles", "J.K. Earthmoving Co", 9800, "USD", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-198" }),
  exp("monrovia", "mon-p2", "2026-08-19", "Machinery", "Excavator / JCB", "Backhoe hire for warehouse foundation, 9 days", "Monrovia Plant Hire", 2900, "USD", "Cash", "Site Engineer", "Approved"),
  exp("monrovia", "mon-p2", "2026-08-22", "Subcontractor", "Shuttering Subcontractor", "Foundation shuttering, 900 sq m", "Coast Builders Formwork", 3800, "USD", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-212" }),
  exp("monrovia", "mon-p2", "2026-08-27", "Site Overheads", "Site Camp & Accommodation", "Site camp rent — August", "Monrovia Properties", 1600, "USD", "Bank Transfer", "Site Manager", "Approved", { receiptNo: "RENT-081" }),
];

/* ------------------------------------------------------------------ */
/* Gurgaon — India, INR                                               */
/* ------------------------------------------------------------------ */

const GURGAON_REMITTANCES: SiteRemittance[] = [
  remit("gurgaon", "2026-08-03", 6000000, "INR", "NEFT/RTGS", "NEFT-39880", "Head Office — Accounts", "August mobilisation against running bill #2"),
  remit("gurgaon", "2026-09-01", 12000000, "INR", "NEFT/RTGS", "NEFT-40218", "Head Office — Accounts", "September mobilisation against running bill #3"),
  remit("gurgaon", "2026-09-10", 10000000, "INR", "NEFT/RTGS", "NEFT-40577", "Head Office — Accounts", "Material procurement tranche"),
];

const GURGAON_EXPENSES: SiteExpense[] = [
  exp("gurgaon", "gur-p1", "2026-09-02", "Material", "Cement — OPC / PPC", "PPC cement 4,200 bags @ ₹285", "Ambuja Cement Depot", 1197000, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-8841" }),
  exp("gurgaon", "gur-p1", "2026-09-03", "Material", "Steel — TMT Bar", "TMT bar 12mm & 16mm, 96 MT", "Jindal Steel Distributor", 4128000, "INR", "Cheque", "Procurement", "Approved", { receiptNo: "INV-8877" }),
  exp("gurgaon", "gur-p1", "2026-09-05", "Subcontractor", "Piling Subcontractor", "Piling for warehouse block A, 42 piles", "Singh Piling Works", 1890000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-1120" }),
  exp("gurgaon", "gur-p1", "2026-09-07", "Labour", "Skilled Labour — Mason / Steel Fixer", "Skilled labour wages — 38 masons & fixers", "Site Cash", 684000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("gurgaon", "gur-p1", "2026-09-07", "Labour", "Unskilled Labour — Helper", "Helper wages — 96 helpers", "Site Cash", 432000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("gurgaon", "gur-p1", "2026-09-09", "Machinery", "Excavator / JCB", "Excavator with operator, 18 shifts", "Gurgaon Earth Movers", 486000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-2044" }),
  exp("gurgaon", "gur-p2", "2026-09-11", "Subcontractor", "Shuttering Subcontractor", "Slab shuttering, 4,200 sq m", "Kumar Formwork Co", 1344000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-1146" }),
  exp("gurgaon", "gur-p2", "2026-09-12", "Material", "Aggregate — Sand / Stone", "M-sand and crushed stone — 240 m³", "Haryana Aggregates", 576000, "INR", "Cash", "Site Engineer", "Approved", { receiptNo: "LOR-5512" }),
  exp("gurgaon", "gur-p1", "2026-09-14", "Machinery", "Crane — Mobile / Tower", "Tower crane hire — September month", "Kumar Crane Hire", 960000, "INR", "Bank Transfer", "Site Manager", "Approved", { receiptNo: "HIR-2051" }),
  exp("gurgaon", "gur-p1", "2026-09-15", "Site Overheads", "Site Electricity — DG Fuel", "Diesel for DG set — 2,400 litres", "HP Fuel Depot", 244800, "INR", "Cash", "Site Engineer", "Approved", { receiptNo: "LOR-5533" }),
  exp("gurgaon", "gur-p2", "2026-09-16", "Labour", "Site Supervisor Wages", "Site staff salaries — September", "Site Cash", 285000, "INR", "Bank Transfer", "Site Manager", "Approved"),
  exp("gurgaon", "gur-p3", "2026-09-17", "Professional Fees", "Architect / Design Fee", "Design development and tender drawings", "Vastu Design Consultants", 450000, "INR", "Cheque", "Head Office", "Approved", { receiptNo: "INV-6612" }),
  exp("gurgaon", "gur-p3", "2026-09-18", "Subcontractor", "MEP Subcontractor", "MEP first fix — cold storage block", "Krishna MEP Services", 862000, "INR", "Bank Transfer", "Site Engineer", "Pending Approval", { receiptNo: "SUB-1171" }),
  exp("gurgaon", "gur-p1", "2026-09-19", "Material", "Electrical Material", "Main switchgear, cable trays, DBs", "Anchor Electricals", 738000, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-8902" }),
  exp("gurgaon", "gur-p1", "2026-09-21", "Labour", "Electrical Labour", "Electrical wiring labour, 12 electricians", "Site Cash", 216000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("gurgaon", "gur-p2", "2026-09-22", "Site Overheads", "Security Fencing / Barricading", "Barricading and safety fencing at site boundary", "SafeGuard Fencing", 164000, "INR", "Cash", "Site Manager", "Approved", { receiptNo: "INV-7741" }),
  exp("gurgaon", "gur-p1", "2026-09-23", "Material", "Bricks / Blockwork", "AAC blocks — 68,000 nos", "Indorama Aeroblocks", 476000, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-8930" }),
  exp("gurgaon", "gur-p1", "2026-09-25", "Professional Fees", "Testing — Cube & Soil Test", "Cube testing 28-day, 90 nos & soil report", "NABL Test Lab", 96000, "INR", "Bank Transfer", "Site Manager", "Approved", { receiptNo: "LAB-902" }),
  exp("gurgaon", "gur-p2", "2026-09-26", "Equipment Hire", "Scaffolding Hire", "Scaffolding for facade work, 22 days", "Gurgaon Scaffolding", 352000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-2063" }),
  exp("gurgaon", "gur-p2", "2026-09-27", "Site Overheads", "Site Cleaning & Debris", "Debris removal and site cleaning", "Shakti Enterprises", 88000, "INR", "Cash", "Site Engineer", "Pending Approval", { receiptNo: "INV-7760" }),
  exp("gurgaon", "gur-p1", "2026-09-28", "Machinery", "Dump / Tipper Truck", "Tipper truck on rent — 12 trips", "Gurgaon Earth Movers", 204000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("gurgaon", "gur-p3", "2026-09-29", "Subcontractor", "Waterproofing Subcontractor", "Basement and terrace waterproofing", "Sealproof Systems", 396000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-1188" }),
  exp("gurgaon", "gur-p1", "2026-09-30", "Site Overheads", "Photocopy / Blue Print", "Working drawings and drawing printouts", "Jindal Xerox Point", 42000, "INR", "Cash", "Site Engineer", "Approved"),

  // --- August 2026 ---
  exp("gurgaon", "gur-p1", "2026-08-05", "Material", "Cement — OPC / PPC", "PPC cement 3,000 bags", "Ambuja Cement Depot", 855000, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-8602" }),
  exp("gurgaon", "gur-p1", "2026-08-09", "Subcontractor", "Excavation Subcontractor", "Bulk excavation, warehouse block A", "Gurgaon Earth Movers", 720000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-1054" }),
  exp("gurgaon", "gur-p1", "2026-08-16", "Machinery", "Crane — Mobile / Tower", "Tower crane hire — August month", "Kumar Crane Hire", 920000, "INR", "Bank Transfer", "Site Manager", "Approved", { receiptNo: "HIR-1988" }),
  exp("gurgaon", "gur-p2", "2026-08-21", "Labour", "Skilled Labour — Mason / Steel Fixer", "Skilled labour wages — August", "Site Cash", 612000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("gurgaon", "gur-p2", "2026-08-26", "Material", "Steel — TMT Bar", "TMT bar 10mm, 54 MT", "Jindal Steel Distributor", 2106000, "INR", "Cheque", "Procurement", "Approved", { receiptNo: "INV-8701" }),
];

/* ------------------------------------------------------------------ */
/* Mumbai — India, INR                                                */
/* ------------------------------------------------------------------ */

const MUMBAI_REMITTANCES: SiteRemittance[] = [
  remit("mumbai", "2026-08-05", 3000000, "INR", "NEFT/RTGS", "NEFT-40110", "Head Office — Accounts", "August mobilisation against running bill #1"),
  remit("mumbai", "2026-09-05", 10000000, "INR", "NEFT/RTGS", "NEFT-41022", "Head Office — Accounts", "September mobilisation against running bill #2"),
];

const MUMBAI_EXPENSES: SiteExpense[] = [
  exp("mumbai", "mum-p1", "2026-09-03", "Subcontractor", "Excavation Subcontractor", "Excavation and backfilling, 2,400 m³", "Mumbai Earth Works", 1140000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-2210" }),
  exp("mumbai", "mum-p1", "2026-09-06", "Material", "Cement — OPC / PPC", "PPC cement 2,600 bags @ ₹282", "Ultratech Depot Bhandup", 733200, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-9210" }),
  exp("mumbai", "mum-p1", "2026-09-08", "Material", "Steel — TMT Bar", "TMT bar 12mm, 72 MT", "Tata Steel Distributor", 3096000, "INR", "Cheque", "Procurement", "Approved", { receiptNo: "INV-9244" }),
  exp("mumbai", "mum-p1", "2026-09-10", "Labour", "Skilled Labour — Mason / Steel Fixer", "Skilled labour wages — 32 masons & fixers", "Site Cash", 576000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("mumbai", "mum-p1", "2026-09-10", "Labour", "Unskilled Labour — Helper", "Helper wages — 78 helpers", "Site Cash", 351000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("mumbai", "mum-p1", "2026-09-12", "Machinery", "Excavator / JCB", "Excavator hire — 14 shifts", "Mumbai Earth Works", 420000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-3310" }),
  exp("mumbai", "mum-p1", "2026-09-15", "Material", "Aggregate — Sand / Stone", "M-sand 180 m³, crushed 120 m³", "Tata Sand Suppliers", 636000, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-9288" }),
  exp("mumbai", "mum-p1", "2026-09-17", "Subcontractor", "Shuttering Subcontractor", "Column and slab shuttering, 2,600 sq m", "Deo Formwork", 832000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-2244" }),
  exp("mumbai", "mum-p1", "2026-09-19", "Machinery", "Crane — Mobile / Tower", "Hydraulic crane hire — 10 shifts", "Mumbai Crane Hire", 520000, "INR", "Bank Transfer", "Site Engineer", "Pending Approval", { receiptNo: "HIR-3327" }),
  exp("mumbai", "mum-p1", "2026-09-21", "Site Overheads", "Site Electricity — DG Fuel", "Diesel 2,000 litres for DG and pumps", "Indian Oil Depot", 204000, "INR", "Cash", "Site Engineer", "Approved", { receiptNo: "LOR-8812" }),
  exp("mumbai", "mum-p1", "2026-09-23", "Labour", "Site Supervisor Wages", "Site staff salaries — September", "Site Cash", 312000, "INR", "Bank Transfer", "Site Manager", "Approved"),
  exp("mumbai", "mum-p1", "2026-09-25", "Professional Fees", "Survey & Land Measurement", "Topographical survey and setting out", "SurveyTech India", 186000, "INR", "Bank Transfer", "Site Manager", "Approved", { receiptNo: "INV-6640" }),
  exp("mumbai", "mum-p1", "2026-09-27", "Site Overheads", "Stationery & Printing", "Site office stationery and drawing prints", "M Xerox", 38000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("mumbai", "mum-p1", "2026-09-29", "Equipment Hire", "Centrifugal Pump Hire", "Dewatering pumps — 18 days", "Mumbai Pump House", 126000, "INR", "Cash", "Site Engineer", "Approved", { receiptNo: "HIR-3331" }),

  // --- August 2026 ---
  exp("mumbai", "mum-p1", "2026-08-07", "Subcontractor", "Piling Subcontractor", "Piling — 32 piles for warehouse block", "Mumbai Piling Works", 1440000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-2150" }),
  exp("mumbai", "mum-p1", "2026-08-18", "Material", "Cement — OPC / PPC", "PPC cement 1,800 bags", "Ultratech Depot Bhandup", 507600, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-9088" }),
  exp("mumbai", "mum-p1", "2026-08-24", "Machinery", "Excavator / JCB", "Excavator hire — 11 shifts", "Mumbai Earth Works", 330000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-3210" }),
];

/* ------------------------------------------------------------------ */
/* Aligarh — India, INR                                               */
/* ------------------------------------------------------------------ */

const ALIGARH_REMITTANCES: SiteRemittance[] = [
  remit("aligarh", "2026-08-05", 1500000, "INR", "Demand Draft", "DD-69880", "Head Office — Accounts", "August foundation and excavation tranche"),
  remit("aligarh", "2026-09-03", 6000000, "INR", "Demand Draft", "DD-70412", "Head Office — Accounts", "PEB fabrication and erection tranche"),
];

const ALIGARH_EXPENSES: SiteExpense[] = [
  exp("aligarh", "ali-p1", "2026-09-04", "Subcontractor", "Shuttering Subcontractor", "Anchor bolt and base plate shuttering", "Agra Formwork Works", 468000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-3310" }),
  exp("aligarh", "ali-p1", "2026-09-06", "Machinery", "Crane — Mobile / Tower", "Hydraulic crane — PEB erection, 9 shifts", "Agra Crane Service", 675000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-4410" }),
  exp("aligarh", "ali-p1", "2026-09-08", "Material", "Structural Steel — Section", "PEB built-up sections, 68 MT fabricated", "Astone Fabrication Unit", 1122000, "INR", "Cheque", "Procurement", "Approved", { receiptNo: "FAB-220" }),
  exp("aligarh", "ali-p1", "2026-09-10", "Labour", "Welder / Fabricator", "Welding and bolting crew wages", "Site Cash", 342000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("aligarh", "ali-p1", "2026-09-12", "Material", "Cement — OPC / PPC", "PPC cement 1,400 bags for anchor block", "Ambuja Cement Depot", 399000, "INR", "Cash", "Site Engineer", "Approved", { receiptNo: "INV-9820" }),
  exp("aligarh", "ali-p1", "2026-09-14", "Equipment Hire", "Scaffolding Hire", "Scaffolding at mezzanine height, 16 days", "Agra Scaffolding", 176000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-4425" }),
  exp("aligarh", "ali-p1", "2026-09-16", "Subcontractor", "Waterproofing Subcontractor", "Roof sheet lap sealing and sealant", "Sealproof Systems", 224000, "INR", "Bank Transfer", "Site Engineer", "Pending Approval", { receiptNo: "SUB-3342" }),
  exp("aligarh", "ali-p1", "2026-09-18", "Labour", "Unskilled Labour — Helper", "Helper wages — 44 helpers", "Site Cash", 198000, "INR", "Cash", "Site Engineer", "Approved"),
  exp("aligarh", "ali-p1", "2026-09-20", "Site Overheads", "Site Camp & Accommodation", "Site camp rent — September", "Aligarh Rentals", 96000, "INR", "Cash", "Site Manager", "Approved", { receiptNo: "RENT-190" }),
  exp("aligarh", "ali-p1", "2026-09-22", "Machinery", "Hydraulic Crane Rental", "Crane idle and demobilisation charges", "Agra Crane Service", 135000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "HIR-4431" }),
  exp("aligarh", "ali-p1", "2026-09-24", "Professional Fees", "Structural Engineer Certification", "Structural certification for PEB frames", "Certified Structural Designs", 180000, "INR", "Cheque", "Head Office", "Approved", { receiptNo: "INV-6712" }),
  exp("aligarh", "ali-p1", "2026-09-26", "Material", "Fasteners & Hardware", "Hdg bolts, nuts and washers — 12,000 sets", "Fixing Fasteners India", 156000, "INR", "Bank Transfer", "Procurement", "Approved", { receiptNo: "INV-9855" }),
  exp("aligarh", "ali-p1", "2026-09-28", "Site Overheads", "Safety — Helmets, Nets, Harness", "PPE and safety net for erection work", "SafeGuard Safety", 118000, "INR", "Cash", "Site Manager", "Approved", { receiptNo: "INV-7822" }),
  exp("aligarh", "ali-p1", "2026-09-30", "Site Overheads", "Communication", "Site internet and mobile recharge", "Airtel Business", 24000, "INR", "Cash", "Site Manager", "Approved"),

  // --- August 2026 ---
  exp("aligarh", "ali-p1", "2026-08-11", "Subcontractor", "Excavation Subcontractor", "Excavation for anchor blocks — 1,100 m³", "Agara Earth Movers", 528000, "INR", "Bank Transfer", "Site Engineer", "Approved", { receiptNo: "SUB-3240" }),
  exp("aligarh", "ali-p1", "2026-08-20", "Material", "Cement — OPC / PPC", "PPC cement 1,000 bags", "Ambuja Cement Depot", 285000, "INR", "Cash", "Site Engineer", "Approved", { receiptNo: "INV-9702" }),
  exp("aligarh", "ali-p1", "2026-08-27", "Machinery", "Excavator / JCB", "Backhoe hire — 9 days", "Agara Earth Movers", 243000, "INR", "Cash", "Site Engineer", "Approved"),
];

/* ------------------------------------------------------------------ */
/* Grouped accessors                                                   */
/* ------------------------------------------------------------------ */

export const REMITTANCES: SiteRemittance[] = [
  ...MONROVIA_REMITTANCES,
  ...GURGAON_REMITTANCES,
  ...MUMBAI_REMITTANCES,
  ...ALIGARH_REMITTANCES,
];

export const EXPENSES: SiteExpense[] = [
  ...MONROVIA_EXPENSES,
  ...GURGAON_EXPENSES,
  ...MUMBAI_EXPENSES,
  ...ALIGARH_EXPENSES,
];

/** Reporting period for every site, matching the Office module. */
export const PERIOD = {
  from: "2026-09-01",
  to: "2026-09-30",
  label: "September 2026",
  month: "2026-09",
} as const;

export function getSite(siteId: string): Site | undefined {
  return SITES.find((s) => s.id === siteId);
}

export function getProjects(siteId: string): SiteProject[] {
  return PROJECTS.filter((p) => p.siteId === siteId);
}

export function getSiteExpenses(siteId: string): SiteExpense[] {
  return EXPENSES.filter((e) => e.siteId === siteId);
}

export function getSiteRemittances(siteId: string): SiteRemittance[] {
  return REMITTANCES.filter((r) => r.siteId === siteId);
}

export function getPeriodExpenses(siteId: string): SiteExpense[] {
  return getSiteExpenses(siteId).filter((e) => e.date >= PERIOD.from && e.date <= PERIOD.to);
}

export function getPriorPeriodExpenses(siteId: string): SiteExpense[] {
  return getSiteExpenses(siteId).filter((e) => e.date < PERIOD.from);
}
