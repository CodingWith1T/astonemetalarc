"use client";

import { useMemo, useState, type ReactNode } from "react";
import { formatCompactINR, formatMoney } from "./format";
import {
  IconArrowDown,
  IconArrowUp,
  IconDownload,
  IconFilter,
  IconPlus,
  IconSearch,
} from "./ui";

export interface FilterDef {
  key: string;
  label: string;
  options: string[];
  allLabel?: string;
}

/**
 * Read a keyed property off an arbitrary row without constraining T.
 *
 * The table kit needs to read untyped keys (sort keys, filter keys, the
 * numeric "amount" column) off rows whose real type is a domain interface.
 * Constraining T to Record<string, unknown> would force every caller to
 * weaken their types, so we read through a narrow helper instead.
 */
function cell(row: unknown, key: string): unknown {
  return row !== null && typeof row === "object"
    ? (row as Record<string, unknown>)[key]
    : undefined;
}

function numCell(row: unknown, key: string): number {
  const v = cell(row, key);
  return typeof v === "number" ? v : 0;
}

export function useTableControls<T>({
  rows,
  pageSize = 10,
  searchFields,
  filters,
  defaultSort,
  dateKey = "date",
  amountKey = "amount",
}: {
  rows: T[];
  pageSize?: number;
  searchFields: (row: T) => string[];
  filters: FilterDef[];
  defaultSort: { key: string; dir: "asc" | "desc" };
  /** Row property holding an ISO date (YYYY-MM-DD) used by the date-range filter. */
  dateKey?: string;
  /** Row property summed into `sum` and shown in totals footers. */
  amountKey?: string;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(defaultSort);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (q) {
        const hay = searchFields(row).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      for (const f of filters) {
        const val = filterValues[f.key];
        if (val && val !== "all") {
          if (String(cell(row, f.key)) !== val) return false;
        }
      }
      if (dateFrom || dateTo) {
        const d = String(cell(row, dateKey) ?? "");
        // Only filter on real ISO dates; rows with other date shapes pass through.
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
          if (dateFrom && d < dateFrom) return false;
          if (dateTo && d > dateTo) return false;
        }
      }
      return true;
    });
  }, [rows, search, searchFields, filterValues, filters, dateFrom, dateTo, dateKey]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = cell(a, sort.key);
      const bv = cell(b, sort.key);
      if (typeof av === "number" && typeof bv === "number") {
        return sort.dir === "asc" ? av - bv : bv - av;
      }
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const total = sorted.length;
  const sum = sorted.reduce((s, r) => s + numCell(r, amountKey), 0);

  const toggleSort = (key: string) =>
    setSort((p) => (p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const activeFilters =
    Object.values(filterValues).filter((v) => v && v !== "all").length + (search ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  return {
    pageRows,
    sorted,
    total,
    sum,
    page: safePage,
    pageCount,
    pageSize,
    setPage,
    search,
    setSearch,
    filterValues,
    setFilter: (k: string, v: string) => setFilterValues((p) => ({ ...p, [k]: v })),
    sort,
    toggleSort,
    activeFilters,
    loading,
    setLoading,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    reset: () => {
      setSearch("");
      setFilterValues({});
      setDateFrom("");
      setDateTo("");
      setPage(1);
    },
  };
}

export type TableControls<T> = ReturnType<typeof useTableControls<T>>;

export function FiltersBar<T>({
  controls,
  filters,
  extra,
}: {
  controls: TableControls<T>;
  filters: FilterDef[];
  extra?: ReactNode;
}) {
  return (
    <div className="fin-filters">
      <div className="fin-filters-head">
        <span className="fin-filters-title">
          <IconFilter size={15} /> Filters
          {controls.activeFilters > 0 && <span className="fin-filter-count">{controls.activeFilters}</span>}
        </span>
        <div className="fin-filters-head-right">
          {extra}
          {controls.activeFilters > 0 && (
            <button className="fin-link-btn" onClick={controls.reset}>
              Clear all
            </button>
          )}
        </div>
      </div>
      <div className="fin-filters-grid">
        <div className="fin-field">
          <label>Search</label>
          <div className="fin-search">
            <IconSearch />
            <input
              value={controls.search}
              placeholder="Search by ID, description, vendor..."
              onChange={(e) => controls.setSearch(e.target.value)}
            />
          </div>
        </div>
        {filters.map((f) => (
          <div className="fin-field" key={f.key}>
            <label>{f.label}</label>
            <select value={controls.filterValues[f.key] ?? "all"} onChange={(e) => controls.setFilter(f.key, e.target.value)}>
              <option value="all">{f.allLabel ?? `All ${f.label}`}</option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className="fin-field">
          <label>Date Range</label>
          <div className="fin-daterange">
            <input
              type="date"
              value={controls.dateFrom}
              onChange={(e) => {
                controls.setDateFrom(e.target.value);
                controls.setPage(1);
              }}
              aria-label="From date"
            />
            <span>to</span>
            <input
              type="date"
              value={controls.dateTo}
              onChange={(e) => {
                controls.setDateTo(e.target.value);
                controls.setPage(1);
              }}
              aria-label="To date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SortHeader({
  label,
  sortKey,
  controls,
  align,
}: {
  label: string;
  sortKey: string;
  controls: { sort: { key: string; dir: "asc" | "desc" }; toggleSort: (k: string) => void };
  align?: "right";
}) {
  const active = controls.sort.key === sortKey;
  return (
    <th
      className={`fin-sortable${align === "right" ? " fin-th-right" : ""}`}
      onClick={() => controls.toggleSort(sortKey)}
    >
      <span className="fin-th-inner">
        {label}
        <span className={`fin-sort-icon${active ? " active" : ""}`}>
          {active ? (controls.sort.dir === "asc" ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />) : "↕"}
        </span>
      </span>
    </th>
  );
}

export function AmountCell({
  amount,
  signed,
  tone,
  currency = "INR",
}: {
  amount: number;
  signed?: boolean;
  tone?: "in" | "out";
  currency?: "INR" | "USD";
}) {
  if (tone === "in") return <span className="fin-amount in">{formatMoney(amount, currency, true)}</span>;
  if (tone === "out") return <span className="fin-amount out">−{formatMoney(amount, currency)}</span>;
  return (
    <span className="fin-amount">
      {signed ? formatMoney(amount, currency, true) : formatMoney(amount, currency)}
    </span>
  );
}

export function TotalsFooter({
  label,
  amount,
  note,
  currency = "INR",
}: {
  label: string;
  amount: number;
  note?: string;
  currency?: "INR" | "USD";
}) {
  return (
    <div className="fin-totals">
      <span className="fin-totals-label">{label}</span>
      <span className="fin-totals-amount">{formatMoney(amount, currency)}</span>
      {note && <span className="fin-totals-note">{note}</span>}
    </div>
  );
}

export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="fin-page-head">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="fin-page-actions">{actions}</div>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="fin-btn fin-btn-primary" onClick={onClick}>
      <IconPlus /> {label}
    </button>
  );
}

export function ExportButton({ onClick, label = "Export" }: { onClick: () => void; label?: string }) {
  return (
    <button className="fin-btn fin-btn-ghost" onClick={onClick}>
      <IconDownload /> {label}
    </button>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
  trendTone = "up",
  onClick,
  active,
  compact,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  trend?: string;
  trendTone?: "up" | "down" | "flat";
  onClick?: () => void;
  active?: boolean;
  compact?: boolean;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      className={`fin-stat${onClick ? " clickable" : ""}${active ? " active" : ""}${compact ? " compact" : ""}`}
      onClick={onClick}
    >
      <div className="fin-stat-top">
        <span className="fin-stat-label">{label}</span>
        {icon && <span className="fin-stat-icon">{icon}</span>}
      </div>
      <div className="fin-stat-value">{value}</div>
      <div className="fin-stat-foot">
        {trend && (
          <span className={`fin-trend fin-trend-${trendTone}`}>
            {trendTone === "up" ? <IconArrowUp size={12} /> : trendTone === "down" ? <IconArrowDown size={12} /> : "•"}
            {trend}
          </span>
        )}
        {sub && <span className="fin-stat-sub">{sub}</span>}
      </div>
    </Tag>
  );
}

export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`fin-card ${className}`}>
      <header className="fin-card-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="fin-card-body">{children}</div>
    </section>
  );
}

export { formatCompactINR };
