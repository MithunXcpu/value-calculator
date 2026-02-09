"use client";

import { useState } from "react";
import { TrendingUp, Clock, AlertTriangle, Users, DollarSign, Target, Calculator, BarChart3 } from "lucide-react";
import { Stage, Assumptions } from "@/lib/types";
import { calculateSummary, calculateStage, formatCurrency, getRoleById } from "@/lib/calculator";
import { calculateAdvancedMetrics, formatIRR, sensitivityAnalysis } from "@/lib/advanced-calculator";
import { MetricCard } from "./MetricCard";
import { SensitivitySlider } from "./SensitivitySlider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

interface Props {
  stages: Stage[];
  assumptions: Assumptions;
}

export function ResultsDashboard({ stages, assumptions }: Props) {
  const [discountRate, setDiscountRate] = useState(0.1);
  const summary = calculateSummary(stages, assumptions);
  const advanced = calculateAdvancedMetrics(stages, assumptions, discountRate);

  const roiColor = summary.roi >= 1 ? "text-secondary" : summary.roi >= 0.5 ? "text-warning" : "text-danger";

  // Bar chart data — hours saved by stage
  const barData = stages.map((s) => {
    const c = calculateStage(s, assumptions);
    return { name: s.name.length > 15 ? s.name.slice(0, 15) + "..." : s.name, hours: Number(c.totalSaved.toFixed(1)) };
  });

  // Pie chart data — savings by role
  const pieData = assumptions.roles
    .map((role) => {
      const value = stages.reduce((sum, s) => {
        const c = calculateStage(s, assumptions);
        const rr = c.roleResults.find((r) => r.roleId === role.id);
        return sum + (rr?.costSaved ?? 0);
      }, 0);
      return { name: role.label, value };
    })
    .filter((d) => d.value > 0);

  // 5-year projection data
  const projectionData = [
    { year: "Year 1", savings: summary.year1, cumulative: summary.year1 },
    { year: "Year 2", savings: summary.year2, cumulative: summary.year1 + summary.year2 },
    { year: "Year 3", savings: summary.year3, cumulative: summary.year1 + summary.year2 + summary.year3 },
    { year: "Year 4", savings: advanced.year4, cumulative: summary.year1 + summary.year2 + summary.year3 + advanced.year4 },
    { year: "Year 5", savings: advanced.year5, cumulative: summary.year1 + summary.year2 + summary.year3 + advanced.year4 + advanced.year5 },
  ];

  // Sensitivity data
  const sensitivityData = sensitivityAnalysis(stages, assumptions).map((s) => ({
    rate: `${(s.rate * 100).toFixed(0)}%`,
    npv: Math.round(s.npv),
  }));

  return (
    <div className="space-y-6">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={TrendingUp} label="ROI" value={`${summary.roi.toFixed(2)}x`} color={roiColor} toggleable />
        <MetricCard icon={Clock} label="Payback" value={`${summary.paybackMonths.toFixed(1)} mo`} toggleable />
        <MetricCard icon={Users} label="Hours Saved" value={`${summary.totalSavedHours.toFixed(0)} hrs/wk`} color="text-secondary" toggleable />
        <MetricCard icon={DollarSign} label="Annual Savings" value={formatCurrency(summary.totalCostSaved, assumptions.currency)} color="text-secondary" toggleable />
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={Calculator}
          label="NPV (5yr)"
          value={formatCurrency(advanced.npv, assumptions.currency)}
          description={`At ${(discountRate * 100).toFixed(0)}% discount rate`}
          toggleable
        />
        <MetricCard
          icon={TrendingUp}
          label="IRR"
          value={formatIRR(advanced.irr)}
          description="Internal rate of return"
          color="text-secondary"
          toggleable
        />
        <MetricCard
          icon={Target}
          label="Break-Even"
          value={`${advanced.breakEvenMonths} mo`}
          description="Cumulative savings > costs"
          toggleable
        />
        <MetricCard
          icon={AlertTriangle}
          label="Cost of Delay"
          value={`${formatCurrency(summary.costOfDelay, assumptions.currency)}/mo`}
          description="Opportunity cost per month"
          color="text-warning"
          toggleable
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hours Saved by Stage */}
        {barData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-muted" />
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Hours Saved by Stage</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip
                    contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }}
                  />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Savings by Role */}
        {pieData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Savings by Role</p>
            <div className="h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }}
                    formatter={(v) => (typeof v === "number" ? formatCurrency(v, assumptions.currency) : String(v))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs mt-2">
              {pieData.map((d, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5-Year Projection */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">5-Year Savings Projection</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} width={60} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }}
                formatter={(v) => (typeof v === "number" ? formatCurrency(v, assumptions.currency) : String(v))}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} name="Annual Savings" />
              <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} name="Cumulative" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SensitivitySlider discountRate={discountRate} onChange={setDiscountRate} />

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">NPV Sensitivity</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sensitivityData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="rate" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }}
                  formatter={(v) => (typeof v === "number" ? formatCurrency(v, assumptions.currency) : String(v))}
                />
                <Bar dataKey="npv" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5-Year Numbers Grid */}
      <div className="grid grid-cols-5 gap-2">
        {projectionData.map((d, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted">{d.year}</p>
            <p className="text-sm font-bold text-secondary">{formatCurrency(d.savings, assumptions.currency)}</p>
            <p className="text-xs text-muted">{["70%", "100%", "107%", "110%", "112%"][i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
