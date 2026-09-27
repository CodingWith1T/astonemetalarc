"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const projectStatusData = [
  { location: "Delhi", value: 0 },
  { location: "Mumbai", value: 3 },
  { location: "Bangalore", value: 6 },
  { location: "Chennai", value: 9 },
  { location: "Kolkata", value: 12 },
];

const callStatusData = [
  { name: "Connected", value: 25, color: "#f50" },
  { name: "Not Connected", value: 15, color: "#0e2f3e" },
  { name: "Callback", value: 12, color: "#2b6cb0" },
  { name: "Interested", value: 18, color: "#38a169" },
  { name: "Not Interested", value: 10, color: "#e53e3e" },
  { name: "We Think Later", value: 8, color: "#805ad5" },
];

const lineData = [
  { month: "Jan", revenue: 45 },
  { month: "Feb", revenue: 52 },
  { month: "Mar", revenue: 48 },
  { month: "Apr", revenue: 61 },
  { month: "May", revenue: 55 },
  { month: "Jun", revenue: 67 },
  { month: "Jul", revenue: 72 },
  { month: "Aug", revenue: 69 },
  { month: "Sep", revenue: 75 },
  { month: "Oct", revenue: 80 },
  { month: "Nov", revenue: 78 },
  { month: "Dec", revenue: 85 },
];

const outcomeData = [
  { name: "Monthly", value: 70, color: "#f50" },
  { name: "Groceries", value: 20, color: "#0e2f3e" },
  { name: "Others", value: 10, color: "#8e8e8f" },
];

const chartTooltip = {
  contentStyle: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    color: "#fff",
  },
  itemStyle: {
    color: "#fff",
  },
  padding: "6px 10px",
};

export function ProjectStatusBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={projectStatusData} margin={{ top: 5, right: 5, left: -20, bottom: 20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#2a2a2a"
          vertical={false}
        />
        <XAxis
          dataKey="location"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8e8e8f", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8e8e8f", fontSize: 12 }}
        />
        <Tooltip contentStyle={chartTooltip.contentStyle} />
        <Bar dataKey="value" fill="#f50" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CallStatusPieChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
        <Pie
          data={callStatusData}
          dataKey="value"
          cx="50%"
          cy="40%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={4}
          label={({ name, value }) => `${name} (${value})`}
        >
          {callStatusData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={chartTooltip.contentStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueLineChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={lineData} margin={{ top: 10, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f50" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f50" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8e8e8f", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8e8e8f", fontSize: 12 }}
        />
        <Tooltip contentStyle={chartTooltip.contentStyle} />
          <Area
          type="monotone"
          dataKey="revenue"
          stroke="#f50"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="admin-stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function OutcomeCategoriesChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
        <Pie
          data={outcomeData}
          dataKey="value"
          cx="50%"
          cy="40%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={4}
          label={({ name, value }) => `${name} (${value})`}
        >
          {outcomeData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={chartTooltip.contentStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}
