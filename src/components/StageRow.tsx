"use client";

import { Stage } from "@/lib/types";
import { StageCalculation } from "@/lib/types";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  stage: Stage;
  calc: StageCalculation;
  currency: string;
  roleALabel: string;
  roleBLabel: string;
  onChange: (updates: Partial<Stage>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const currSymbols: Record<string, string> = { USD: "$", GBP: "£", EUR: "€" };

export function StageRow({ stage, calc, currency, roleALabel, roleBLabel, onChange, onRemove, canRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const sym = currSymbols[currency] || "$";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 gap-2 items-center px-4 py-3">
        <div className="col-span-3 md:col-span-2">
          <input
            type="text"
            value={stage.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full bg-transparent border-b border-border px-1 py-1 text-sm font-medium focus:outline-none focus:border-primary"
          />
        </div>
        <div className="col-span-1">
          <input type="number" value={stage.baselineA} onChange={(e) => onChange({ baselineA: Number(e.target.value) })} className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-primary focus:outline-none" title={`Baseline ${roleALabel}`} />
        </div>
        <div className="col-span-1">
          <input type="number" value={stage.baselineB} onChange={(e) => onChange({ baselineB: Number(e.target.value) })} className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-primary focus:outline-none" title={`Baseline ${roleBLabel}`} />
        </div>
        <div className="col-span-1">
          <div className="relative">
            <input type="number" value={stage.gainA} min={0} max={100} onChange={(e) => onChange({ gainA: Math.min(100, Math.max(0, Number(e.target.value))) })} className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
        </div>
        <div className="col-span-1">
          <input type="number" value={stage.gainB} min={0} max={100} onChange={(e) => onChange({ gainB: Math.min(100, Math.max(0, Number(e.target.value))) })} className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-primary focus:outline-none" />
        </div>
        <div className="col-span-1 text-xs text-muted text-center">{calc.afterA.toFixed(1)}</div>
        <div className="col-span-1 text-xs text-muted text-center">{calc.afterB.toFixed(1)}</div>
        <div className="col-span-1 text-xs text-secondary font-medium text-center">{calc.totalSaved.toFixed(1)}</div>
        <div className="col-span-1 text-xs text-secondary font-semibold text-center">{sym}{Math.round(calc.costSaved).toLocaleString()}</div>
        <div className="col-span-1 flex items-center justify-end gap-1">
          <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-card-hover rounded transition-colors text-muted hover:text-foreground">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {canRemove && (
            <button onClick={onRemove} className="p-1 hover:bg-danger/10 rounded transition-colors text-muted hover:text-danger">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <label className="block text-xs text-muted mb-1">Assumptions</label>
            <textarea value={stage.assumptions} onChange={(e) => onChange({ assumptions: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Key assumptions behind the % gain..." />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Rationale</label>
            <textarea value={stage.rationale} onChange={(e) => onChange({ rationale: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Why this efficiency gain is achievable..." />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">People Affected</label>
            <input type="number" value={stage.peopleAffected} onChange={(e) => onChange({ peopleAffected: Number(e.target.value) })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Workflow Description</label>
            <textarea value={stage.workflow} onChange={(e) => onChange({ workflow: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Current workflow steps..." />
          </div>
        </div>
      )}
    </div>
  );
}
