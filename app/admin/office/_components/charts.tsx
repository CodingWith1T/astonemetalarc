"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINR } from "../_lib/office-data";

const PALETTE = ["#f97316", "#0e2f3e", "#1d7a8c", "#b45309", "#64748b", "#0f766e", "#a21caf"];

const tooltipStyle = {
  backgroundColor: "#0e2f3e",
  border: "1px solid #1d3748",
  borderRadius: 8,
  fontSize: 12,
  color: "#fff",
  padding: "8px 12px",
};

const axisStyle = { fontSize: 11, fill: "#777778" };

const fmtShort = (v: number) =>
  Math.abs(v) >= 100000 ? `${(v / 100000).toFixed(2)}L` : Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v);

/* Recharts value type is ValueType (number | string | array) */
function inrTooltip(value: unknown, name: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  const label = typeof name === "string" ? name : String(name ?? "value");
  return [Number.isFinite(n) ? formatINR(n) : String(value), label] as [string, string];
}

export function DonutChart({
  data,
  height = 280,
  valueKey = "value",
  nameKey = "name",
}: {
  data: Record<string, string | number>[];
  height?: number;
  valueKey?: string;
  nameKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data as unknown as Array<Record<string, number>>}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={inrTooltip}
          itemStyle={{ color: "#fff" }}
          labelStyle={{ color: "#fff" }}
        />
        <Legend
          verticalAlign="bottom"
          height={54}
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span style={{ fontSize: 11, color: "#49494b" }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart({
  data,
  height = 300,
  dataKey = "value",
  nameKey = "name",
}: {
  data: Record<string, string | number>[];
  height?: number;
  dataKey?: string;
  nameKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data as unknown as Array<Record<string, number>>} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ececec" vertical={false} />
        <XAxis dataKey={nameKey} tick={axisStyle} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={54} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={52} />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(15,47,62,0.05)" }}
          formatter={inrTooltip}
        />
        <Bar dataKey={dataKey} radius={[5, 5, 0, 0]} maxBarSize={46}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyTrendChart({ data, height = 280 }: { data: Record<string, number | string>[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ececec" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={52} />
        <Tooltip contentStyle={tooltipStyle} formatter={inrTooltip} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => <span style={{ fontSize: 11, color: "#49494b" }}>{v}</span>}
        />
        <Line type="monotone" dataKey="funds" name="Funds Received" stroke="#0e2f3e" strokeWidth={2.2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f97316" strokeWidth={2.2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="balance" name="Balance" stroke="#16a34a" strokeWidth={2.2} strokeDasharray="5 4" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function FundsFlowChart({
  opening,
  funds,
  available,
  expenses,
  closing,
}: {
  opening: number;
  funds: number;
  available: number;
  expenses: number;
  closing: number;
}) {
  const data = [
    { name: "Opening Balance", value: opening, color: "#64748b" },
    { name: "Funds Received", value: funds, color: "#16a34a" },
    { name: "Available Funds", value: available, color: "#0e2f3e" },
    { name: "Expenses", value: expenses, color: "#f97316" },
    { name: "Closing Balance", value: closing, color: "#b45309" },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ececec" horizontal={false} />
        <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
        <YAxis type="category" dataKey="name" tick={{ ...axisStyle, width: 108 }} axisLine={false} tickLine={false} width={112} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,47,62,0.05)" }} formatter={inrTooltip} />
        <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={24}>
          {data.map((_, i) => (
            <Cell key={i} fill={data[i].color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DepartmentBarChart({
  data,
  height = 300,
}: {
  data: Record<string, string | number>[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data as unknown as Array<Record<string, number>>} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ececec" horizontal={false} />
        <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
        <YAxis type="category" dataKey="name" tick={{ ...axisStyle, width: 100 }} axisLine={false} tickLine={false} width={104} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,47,62,0.05)" }} formatter={inrTooltip} />
        <Bar dataKey="value" fill="#0e2f3e" radius={[0, 5, 5, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
