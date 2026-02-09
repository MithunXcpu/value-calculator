"use client";

import { Stage, Assumptions, RoleAllocation } from "@/lib/types";
import { calculateStage, formatCurrency, getRoleById } from "@/lib/calculator";
import { GainSlider } from "./GainSlider";
import { ChevronDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  stage: Stage;
  index: number;
  assumptions: Assumptions;
  onUpdate: (updates: Partial<Stage>) => void;
  onUpdateAllocation: (roleId: string, updates: Partial<RoleAllocation>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function StageCard({ stage, index, assumptions, onUpdate, onUpdateAllocation, onRemove, canRemove }: Props) {
  const [expanded, setExpanded] = useState(index === 0);
  const calc = calculateStage(stage, assumptions);
  const sym = { USD: "$", GBP: "\u00a3", EUR: "\u20ac" }[assumptions.currency] || "$";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-card-hover/50 transition-colors"
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-subtle flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{stage.name}</p>
          <p className="text-xs text-muted mt-0.5">
            {assumptions.roles.length} role{assumptions.roles.length !== 1 ? "s" : ""} · {stage.peopleAffected} people affected
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs text-muted">Hours Saved</p>
            <p className="text-sm font-bold text-secondary">{calc.totalSaved.toFixed(1)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Value</p>
            <p className="text-sm font-bold text-secondary">{sym}{Math.round(calc.costSaved).toLocaleString()}</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 border-t border-border pt-4 space-y-5">
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted flex-shrink-0">Stage Name</label>
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Role Breakdown</p>
                {stage.roleAllocations.map((alloc) => {
                  const role = getRoleById(assumptions.roles, alloc.roleId);
                  if (!role) return null;
                  return (
                    <div key={alloc.roleId} className="bg-surface border border-border rounded-lg p-4">
                      <GainSlider
                        roleLabel={role.label}
                        baseline={alloc.baseline}
                        gain={alloc.gain}
                        onBaselineChange={(v) => onUpdateAllocation(alloc.roleId, { baseline: v })}
                        onGainChange={(v) => onUpdateAllocation(alloc.roleId, { gain: v })}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Assumptions</label>
                  <textarea
                    value={stage.assumptions}
                    onChange={(e) => onUpdate({ assumptions: e.target.value })}
                    rows={2}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Key assumptions behind the efficiency gain..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Rationale</label>
                  <textarea
                    value={stage.rationale}
                    onChange={(e) => onUpdate({ rationale: e.target.value })}
                    rows={2}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Why this efficiency gain is achievable..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">People Affected</label>
                  <input
                    type="number"
                    value={stage.peopleAffected}
                    onChange={(e) => onUpdate({ peopleAffected: Number(e.target.value) })}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Workflow Description</label>
                  <textarea
                    value={stage.workflow}
                    onChange={(e) => onUpdate({ workflow: e.target.value })}
                    rows={2}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Current workflow steps..."
                  />
                </div>
              </div>

              {canRemove && (
                <div className="flex justify-end">
                  <button
                    onClick={onRemove}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-danger hover:bg-danger-subtle rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove Stage
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
