"use client";

import { Assumptions, Currency } from "@/lib/types";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { useState } from "react";

interface Props {
  assumptions: Assumptions;
  onChange: (a: Assumptions) => void;
}

export function AssumptionsPanel({ assumptions, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const set = <K extends keyof Assumptions>(key: K, val: Assumptions[K]) => {
    onChange({ ...assumptions, [key]: val });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card-hover transition-colors">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Global Assumptions</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
      </button>
      {open && (
        <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Role A Label" value={assumptions.roleALabel} onChange={(v) => set("roleALabel", v)} />
          <NumField label="Role A Rate ($/hr)" value={assumptions.rateA} onChange={(v) => set("rateA", v)} />
          <Field label="Role B Label" value={assumptions.roleBLabel} onChange={(v) => set("roleBLabel", v)} />
          <NumField label="Role B Rate ($/hr)" value={assumptions.rateB} onChange={(v) => set("rateB", v)} />
          <NumField label="Hours/Week" value={assumptions.hoursPerWeek} onChange={(v) => set("hoursPerWeek", v)} />
          <NumField label="Loaded Multiplier" value={assumptions.loadedMultiplier} onChange={(v) => set("loadedMultiplier", v)} step={0.1} />
          <NumField label="Annual Tool Cost ($)" value={assumptions.annualToolCost} onChange={(v) => set("annualToolCost", v)} />
          <div>
            <label className="block text-xs text-muted mb-1">Currency</label>
            <select
              value={assumptions.currency}
              onChange={(e) => set("currency", e.target.value as Currency)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
    </div>
  );
}

function NumField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input type="number" value={value} step={step} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
    </div>
  );
}
