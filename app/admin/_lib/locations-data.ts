export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
}

export interface FundTransaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}

export interface Project {
  id: string;
  name: string;
  received: number;
  expenses: number;
  currency: string;
  description?: string;
  expenseItems?: ExpenseItem[];
  area?: string;
  duration?: string;
}

export interface LocationData {
  id: string;
  name: string;
  country: string;
  currency: string;
  received: number;
  expenses: number;
  projects: Project[];
  funds: FundTransaction[];
}

function createExpenseItems(items: Array<{
  category: string;
  amount: number;
  currency: string;
  date: string;
}>): ExpenseItem[] {
  return items.map((item, index) => ({
    id: `exp-${index}`,
    ...item,
  }));
}

export const initialLocations: LocationData[] = [
  {
    id: "monrovia",
    name: "Monrovia",
    country: "Liberia",
    currency: "$",
    received: 25000,
    expenses: 24020,
    projects: [
      {
        id: "monrovia-1",
        name: "Administration Building",
        received: 15000,
        expenses: 16440,
        currency: "$",
        description: "Coast Guard Administrative Building renovation project",
        area: "5,000 sq ft",
        duration: "6 months",
        expenseItems: createExpenseItems([
          { category: "Grocery", amount: 45, currency: "$", date: "12 Aug 2026" },
          { category: "Grocery", amount: 80, currency: "$", date: "14 Aug 2026" },
          { category: "Abhishek sim recharge", amount: 5, currency: "$", date: "12 Aug 2026" },
          { category: "Ashwani sim recharge", amount: 5, currency: "$", date: "12 Aug 2026" },
          { category: "Car Petrol", amount: 40, currency: "$", date: "12 Aug 2026" },
          { category: "Site Petrol", amount: 20, currency: "$", date: "12 Aug 2026" },
          { category: "Weekly Labour Payment", amount: 4140, currency: "$", date: "13 Aug 2026" },
          { category: "J. Mil Monthly Salary", amount: 450, currency: "$", date: "15 Aug 2026" },
          { category: "Fasama Monthly Salary", amount: 450, currency: "$", date: "15 Aug 2026" },
          { category: "Soman Salary", amount: 450, currency: "$", date: "15 Aug 2026" },
          { category: "Steven Driver Salary", amount: 150, currency: "$", date: "15 Aug 2026" },
          { category: "Chukupii House Maid Salary", amount: 100, currency: "$", date: "15 Aug 2026" },
          { category: "Steel Materials", amount: 5000, currency: "$", date: "05 Aug 2026" },
          { category: "Cement & Concrete", amount: 2500, currency: "$", date: "06 Aug 2026" },
          { category: "Electrical Work", amount: 1200, currency: "$", date: "10 Aug 2026" },
          { category: "Plumbing", amount: 500, currency: "$", date: "12 Aug 2026" },
          { category: "Transport (Truck Rental)", amount: 800, currency: "$", date: "08 Aug 2026" },
        ]),
      },
      {
        id: "monrovia-2",
        name: "Warehouse Project",
        received: 10000,
        expenses: 7580,
        currency: "$",
        description: "Warehouse construction for logistics operations",
        area: "10,000 sq ft",
        duration: "8 months",
        expenseItems: createExpenseItems([
          { category: "Grocery", amount: 80, currency: "$", date: "12 Aug 2026" },
          { category: "Abhishek sim recharge", amount: 5, currency: "$", date: "12 Aug 2026" },
          { category: "Ashwani sim recharge", amount: 5, currency: "$", date: "12 Aug 2026" },
          { category: "Car Petrol", amount: 30, currency: "$", date: "12 Aug 2026" },
          { category: "Site Petrol", amount: 15, currency: "$", date: "12 Aug 2026" },
          { category: "Weekly Labour Payment", amount: 800, currency: "$", date: "13 Aug 2026" },
          { category: "J. Mil Monthly Salary", amount: 450, currency: "$", date: "15 Aug 2026" },
          { category: "Soman Salary", amount: 450, currency: "$", date: "15 Aug 2026" },
          { category: "Steven Driver Salary", amount: 150, currency: "$", date: "15 Aug 2026" },
          { category: "Steel Structure", amount: 3500, currency: "$", date: "03 Aug 2026" },
          { category: "Roofing Sheets", amount: 1000, currency: "$", date: "04 Aug 2026" },
          { category: "Foundation Work", amount: 600, currency: "$", date: "08 Aug 2026" },
          { category: "Electrical Work", amount: 300, currency: "$", date: "10 Aug 2026" },
          { category: "Doors & Windows", amount: 200, currency: "$", date: "12 Aug 2026" },
        ]),
      },
    ],
    funds: [
      { id: "f1", date: "01 Sep", amount: 5000, method: "Bank", reference: "TRX001" },
      { id: "f2", date: "08 Sep", amount: 7000, method: "Bank", reference: "TRX002" },
      { id: "f3", date: "15 Sep", amount: 6000, method: "Cash", reference: "TRX003" },
      { id: "f4", date: "22 Sep", amount: 7000, method: "Bank", reference: "TRX004" },
    ],
  },
  {
    id: "gurgaon",
    name: "Gurgaon",
    country: "India",
    currency: "₹",
    received: 850000,
    expenses: 720000,
    projects: [
      { id: "gurgaon-1", name: "Warehouse Complex", received: 350000, expenses: 310000, currency: "₹", description: "Multi-story warehouse complex", area: "50,000 sq ft", duration: "12 months" },
      { id: "gurgaon-2", name: "Factory Shed Phase 1", received: 200000, expenses: 180000, currency: "₹", description: "Phase 1 factory shed construction", area: "25,000 sq ft", duration: "6 months" },
      { id: "gurgaon-3", name: "Factory Shed Phase 2", received: 150000, expenses: 130000, currency: "₹", description: "Phase 2 factory shed construction", area: "20,000 sq ft", duration: "5 months" },
      { id: "gurgaon-4", name: "Cold Storage Unit", received: 150000, expenses: 100000, currency: "₹", description: "Prefabricated cold storage facility", area: "15,000 sq ft", duration: "4 months" },
    ],
    funds: [],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    currency: "₹",
    received: 520000,
    expenses: 480000,
    projects: [
      { id: "mumbai-1", name: "Industrial Warehouse", received: 520000, expenses: 480000, currency: "₹", description: "Industrial warehouse construction", area: "40,000 sq ft", duration: "10 months" },
    ],
    funds: [],
  },
  {
    id: "aligarh",
    name: "Aligarh",
    country: "India",
    currency: "₹",
    received: 310000,
    expenses: 275000,
    projects: [
      { id: "aligarh-1", name: "PEB Structure", received: 310000, expenses: 275000, currency: "₹", description: "Pre-engineered building structure", area: "30,000 sq ft", duration: "8 months" },
    ],
    funds: [],
  },
];

export const STORAGE_KEY = "astone_admin_locations";

export function getStoredLocations(): LocationData[] {
  if (typeof localStorage === "undefined") return initialLocations;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialLocations;
    }
  }
  return initialLocations;
}

export function saveLocations(locations: LocationData[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
}

export function findLocation(
  locations: LocationData[],
  id: string
): LocationData | undefined {
  return locations.find((loc) => loc.id === id);
}

export function findProject(
  locations: LocationData[],
  locationId: string,
  projectId: string
): Project | undefined {
  const loc = findLocation(locations, locationId);
  if (!loc) return undefined;
  return loc.projects.find((p) => p.id === projectId);
}

export function generateProjectStaticParams() {
  return initialLocations.flatMap((loc) =>
    loc.projects.map((proj) => ({
      id: loc.id,
      projectId: proj.id,
    }))
  );
}

export function formatCurrency(amount: number, currency: string): string {
  if (currency === "$") {
    return `$${Math.abs(amount).toLocaleString()}`;
  }
  const formatted = Math.abs(amount).toLocaleString("en-IN");
  return `${currency}${formatted}`;
}

export function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent =
    headers.join(",") +
    "\n" +
    rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const locationStaticParams = initialLocations.map((loc) => ({
  id: loc.id,
}));

export function getCurrencyTotals(
  locations: LocationData[]
): Record<string, { received: number; expenses: number }> {
  const totals: Record<string, { received: number; expenses: number }> = {};
  locations.forEach((loc) => {
    if (!totals[loc.currency]) {
      totals[loc.currency] = { received: 0, expenses: 0 };
    }
    totals[loc.currency].received += loc.received;
    totals[loc.currency].expenses += loc.expenses;
  });
  return totals;
}
