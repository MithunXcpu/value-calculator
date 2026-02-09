"use client";

import { Summary, Assumptions, Stage } from "@/lib/types";
import { calculateSummary, calculateStage, formatCurrency } from "@/lib/calculator";
import { TrendingUp, Clock, AlertTriangle, Users, FileDown, Save } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Props {
  stages: Stage[];
  assumptions: Assumptions;
  onSave: () => void;
  onExportPDF: () => void;
}

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

export function SummaryPanel({ stages, assumptions, onSave, onExportPDF }: Props) {
  const summary = calculateSummary(stages, assumptions);
  const roiColor = summary.roi >= 1 ? "text-secondary" : summary.roi >= 0.5 ? "text-warning" : "text-danger";

  const barData = stages.map((s) => {
    const c = calculateStage(s, assumptions);
    return { name: s.name.length > 12 ? s.name.slice(0, 12) + "..." : s.name, hours: Number(c.totalSaved.toFixed(1)) };
  });

  const pieData = [
    { name: assumptions.roleALabel, value: stages.reduce((sum, s) => sum + calculateStage(s, assumptions).savedA * assumptions.rateA, 0) },
    { name: assumptions.roleBLabel, value: stages.reduce((sum, s) => sum + calculateStage(s, assumptions).savedB * assumptions.rateB, 0) },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6 sticky top-20">
      <h3 className="font-semibold text-sm text-muted uppercase tracking-wider">Summary</h3>

      <div className="text-center">
        <p className="text-xs text-muted mb-1">Return on Investment</p>
        <p className={`text-4xl font-bold ${roiColor}`}>{summary.roi.toFixed(2)}x</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon={Clock} label="Payback Period" value={`${summary.paybackMonths.toFixed(1)} mo`} />
        <MetricCard icon={AlertTriangle} label="Cost of Delay" value={`${formatCurrency(summary.costOfDelay, assumptions.currency)}/mo`} />
        <MetricCard icon={Users} label="Hours Saved" value={`${summary.totalSavedHours.toFixed(0)} hrs`} color="text-secondary" />
        <MetricCard icon={TrendingUp} label="Annual Savings" value={formatCurrency(summary.totalCostSaved, assumptions.currency)} color="text-secondary" />
      </div>

      <div>
        <p className="text-xs text-muted mb-2">3-Year Projection</p>
        <div className="grid grid-cols-3 gap-2">
          <YearBox label="Year 1" value={formatCurrency(summary.year1, assumptions.currency)} sub="70%" />
          <YearBox label="Year 2" value={formatCurrency(summary.year2, assumptions.currency)} sub="100%" />
          <YearBox label="Year 3" value={formatCurrency(summary.year3, assumptions.currency)} sub="107%" />
        </div>
      </div>

      <div>
        <p className="text-xs text-muted mb-2">Hours Saved by Stage</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted mb-2">Savings by Role</p>
        <div className="h-32 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={4}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} formatter={(v) => typeof v === "number" ? formatCurrency(v, assumptions.currency) : String(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs">
          {pieData.map((d, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: CHART_COLORS[i] }}></span>
              {d.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> Save
        </button>
        <button onClick={onExportPDF} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border hover:bg-card-hover rounded-lg text-sm font-medium transition-colors">
          <FileDown className="w-4 h-4" /> PDF
        </button>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color = "text-foreground" }: { icon: React.ElementType; label: string; value: string; color?: string }) {
  return (
    <div className="bg-background border border-border rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-muted" />
        <span className="text-xs text-muted">{label}</span>
      </div>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}

function YearBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-background border border-border rounded-lg p-2 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm font-bold text-secondary">{value}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}
