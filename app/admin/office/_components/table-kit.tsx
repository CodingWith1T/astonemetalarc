"use client";

import { useMemo, useState, type ReactNode } from "react";
import { OFFICE, formatCompactINR, formatINR } from "../_lib/office-data";
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

export function useTableControls<T>({
  rows,
  pageSize = 10,
  searchFields,
  filters,
  defaultSort,
}: {
  rows: T[];
  pageSize?: number;
  searchFields: (row: T) => string[];
  filters: FilterDef[];
  defaultSort: { key: string; dir: "asc" | "desc" };
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(defaultSort);
  const [loading, setLoading] = useState(false);

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
          const value = (row as Record<string, unknown>)[f.key];
          if (String(value) !== val) return false;
        }
      }
      return true;
    });
  }, [rows, search, searchFields, filterValues, filters]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.key];
      const bv = (b as Record<string, unknown>)[sort.key];
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
  const sum = sorted.reduce(
    (s, r) => s + (typeof (r as Record<string, unknown>).amount === "number" ? ((r as Record<string, unknown>).amount as number) : 0),
    0
  );

  const toggleSort = (key: string) =>
    setSort((p) => (p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const activeFilters = Object.values(filterValues).filter((v) => v && v !== "all").length + (search ? 1 : 0);

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
    reset: () => {
      setSearch("");
      setFilterValues({});
      setPage(1);
    },
  };
}

export function FiltersBar({
  controls,
  filters,
  extra,
}: {
  controls: ReturnType<typeof useTableControls<Record<string, unknown>>>;
  filters: FilterDef[];
  extra?: ReactNode;
}) {
  return (
    <div className="of-filters">
      <div className="of-filters-head">
        <span className="of-filters-title">
          <IconFilter size={15} /> Filters
          {controls.activeFilters > 0 && <span className="of-filter-count">{controls.activeFilters}</span>}
        </span>
        <div className="of-filters-head-right">
          {extra}
          {controls.activeFilters > 0 && (
            <button className="of-link-btn" onClick={controls.reset}>
              Clear all
            </button>
          )}
        </div>
      </div>
      <div className="of-filters-grid">
        <div className="of-field">
          <label>Search</label>
          <div className="of-search">
            <IconSearch />
            <input
              value={controls.search}
              placeholder="Search by ID, description, vendor..."
              onChange={(e) => controls.setSearch(e.target.value)}
            />
          </div>
        </div>
        {filters.map((f) => (
          <div className="of-field" key={f.key}>
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
        <div className="of-field">
          <label>Date Range</label>
          <div className="of-daterange">
            <input type="date" defaultValue={OFFICE.periodFrom} aria-label="From date" />
            <span>to</span>
            <input type="date" defaultValue={OFFICE.periodTo} aria-label="To date" />
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
      className={`of-sortable${align === "right" ? " of-th-right" : ""}`}
      onClick={() => controls.toggleSort(sortKey)}
    >
      <span className="of-th-inner">
        {label}
        <span className={`of-sort-icon${active ? " active" : ""}`}>
          {active ? (controls.sort.dir === "asc" ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />) : "↕"}
        </span>
      </span>
    </th>
  );
}

export function AmountCell({ amount, signed, tone }: { amount: number; signed?: boolean; tone?: "in" | "out" }) {
  if (tone === "in") return <span className="of-amount in">{formatINR(amount, true)}</span>;
  if (tone === "out") return <span className="of-amount out">−{formatINR(amount)}</span>;
  return <span className="of-amount">{signed ? formatINR(amount, true) : formatINR(amount)}</span>;
}

export function TotalsFooter({ label, amount, note }: { label: string; amount: number; note?: string }) {
  return (
    <div className="of-totals">
      <span className="of-totals-label">{label}</span>
      <span className="of-totals-amount">{formatINR(amount)}</span>
      {note && <span className="of-totals-note">{note}</span>}
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
    <div className="of-page-head">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="of-page-actions">{actions}</div>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="of-btn of-btn-primary" onClick={onClick}>
      <IconPlus /> {label}
    </button>
  );
}

export function ExportButton({ onClick, label = "Export" }: { onClick: () => void; label?: string }) {
  return (
    <button className="of-btn of-btn-ghost" onClick={onClick}>
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
      className={`of-stat${onClick ? " clickable" : ""}${active ? " active" : ""}${compact ? " compact" : ""}`}
      onClick={onClick}
    >
      <div className="of-stat-top">
        <span className="of-stat-label">{label}</span>
        {icon && <span className="of-stat-icon">{icon}</span>}
      </div>
      <div className="of-stat-value">{value}</div>
      <div className="of-stat-foot">
        {trend && (
          <span className={`of-trend of-trend-${trendTone}`}>
            {trendTone === "up" ? <IconArrowUp size={12} /> : trendTone === "down" ? <IconArrowDown size={12} /> : "•"}
            {trend}
          </span>
        )}
        {sub && <span className="of-stat-sub">{sub}</span>}
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
    <section className={`of-card ${className}`}>
      <header className="of-card-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="of-card-body">{children}</div>
    </section>
  );
}

export { formatCompactINR };
