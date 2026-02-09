"use client";

import { useState } from "react";
import { Assumptions, Stage } from "@/lib/types";
import { calculateSummary, calculateStage, formatCurrency, getRoleById } from "@/lib/calculator";
import { calculateAdvancedMetrics, formatIRR } from "@/lib/advanced-calculator";
import { TrendingUp, Clock, AlertTriangle, Users, FileDown, Save, ChevronDown, ChevronUp, Target, BarChart3, DollarSign, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Props {
  stages: Stage[];
  assumptions: Assumptions;
  onSave: () => void;
  onExportPDF: () => void;
}

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

export function SummaryPanel({ stages, assumptions, onSave, onExportPDF }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const summary = calculateSummary(stages, assumptions);
  const advanced = calculateAdvancedMetrics(stages, assumptions);
  const roiColor = summary.roi >= 1 ? "text-secondary" : summary.roi >= 0.5 ? "text-warning" : "text-danger";

  const barData = stages.map((s) => {
    const c = calculateStage(s, assumptions);
    return { name: s.name.length > 12 ? s.name.slice(0, 12) + "..." : s.name, hours: Number(c.totalSaved.toFixed(1)) };
  });

  // Build pie data dynamically from all roles
  const pieData = assumptions.roles.map((role) => {
    const value = stages.reduce((sum, s) => {
      const c = calculateStage(s, assumptions);
      const roleResult = c.roleResults.find((r) => r.roleId === role.id);
      return sum + (roleResult?.costSaved ?? 0);
    }, 0);
    return { name: role.label, value };
  }).filter((d) => d.value > 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6 sticky top-20">
      <h3 className="font-semibold text-xs text-muted uppercase tracking-wider">Summary</h3>

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

      {/* Advanced Metrics Toggle */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-2 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <span className="uppercase tracking-wider">Advanced Metrics</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showAdvanced && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <MetricCard
              icon={Target}
              label="NPV (5yr)"
              value={formatCurrency(advanced.npv, assumptions.currency)}
              color={advanced.npv > 0 ? "text-secondary" : "text-danger"}
            />
            <MetricCard
              icon={BarChart3}
              label="IRR"
              value={formatIRR(advanced.irr)}
              color="text-primary"
            />
            <MetricCard
              icon={DollarSign}
              label="TCO (5yr)"
              value={formatCurrency(advanced.tco, assumptions.currency)}
            />
            <MetricCard
              icon={CalendarCheck}
              label="Break-Even"
              value={advanced.breakEvenMonths >= 60 ? "60+ mo" : `${advanced.breakEvenMonths} mo`}
              color={advanced.breakEvenMonths <= 12 ? "text-secondary" : "text-warning"}
            />
          </div>
        )}
      </div>

      {/* 5-Year Projection */}
      <div>
        <p className="text-xs text-muted mb-2">5-Year Projection</p>
        <div className="grid grid-cols-5 gap-1.5">
          <YearBox label="Yr 1" value={formatCurrency(summary.year1, assumptions.currency)} sub="70%" />
          <YearBox label="Yr 2" value={formatCurrency(summary.year2, assumptions.currency)} sub="100%" />
          <YearBox label="Yr 3" value={formatCurrency(summary.year3, assumptions.currency)} sub="107%" />
          <YearBox label="Yr 4" value={formatCurrency(advanced.year4, assumptions.currency)} sub="110%" />
          <YearBox label="Yr 5" value={formatCurrency(advanced.year5, assumptions.currency)} sub="112%" />
        </div>
        <p className="text-xs text-muted text-center mt-1.5">
          5-Year Total: <span className="font-semibold text-secondary">{formatCurrency(summary.year1 + summary.year2 + summary.year3 + advanced.year4 + advanced.year5, assumptions.currency)}</span>
        </p>
      </div>

      {barData.length > 0 && (
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
      )}

      {pieData.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-2">Savings by Role</p>
          <div className="h-32 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={4}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} formatter={(v) => typeof v === "number" ? formatCurrency(v, assumptions.currency) : String(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {pieData.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}></span>
                {d.name}
              </span>
            ))}
          </div>
        </div>
      )}

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
    <div className="bg-background border border-border rounded-lg p-1.5 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xs font-bold text-secondary">{value}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}
