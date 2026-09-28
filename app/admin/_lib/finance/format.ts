/**
 * Shared formatting helpers for all finance modules (Office, Sites, Procurement).
 *
 * Indian number grouping is mandatory for INR: ₹1,50,000 — never ₹150,000.
 * en-IN locale gives us that for free.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const INR = "₹";
export const USD = "$";

export function formatINR(amount: number, withSign = false): string {
  const abs = Math.abs(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  if (withSign) {
    if (amount > 0) return `+₹${abs}`;
    if (amount < 0) return `−₹${abs}`;
  }
  return `₹${abs}`;
}

export function formatCompactINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "−" : "";
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)} K`;
  return `${sign}₹${abs}`;
}

export function formatUSD(amount: number, withSign = false): string {
  const abs = Math.abs(amount).toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (withSign) {
    if (amount > 0) return `+$${abs}`;
    if (amount < 0) return `−$${abs}`;
  }
  return `$${abs}`;
}

/** Format in a given currency code. INR uses Indian grouping, others use western. */
export function formatMoney(amount: number, currency: "INR" | "USD", withSign = false): string {
  return currency === "USD" ? formatUSD(amount, withSign) : formatINR(amount, withSign);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}

export function formatDateShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]}`;
}

export function formatDateTime(isoDate: string, time: string): string {
  return `${formatDate(isoDate)} · ${time}`;
}

/** "2026-09-15" + "10:15 AM" */
export function formatTimestamp(isoDate: string, time: string): string {
  return `${formatDate(isoDate)} · ${time}`;
}

export function formatPercent(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}
