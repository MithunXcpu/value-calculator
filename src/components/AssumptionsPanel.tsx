"use client";

import { Assumptions, Currency, Role } from "@/lib/types";
import { RolesManager } from "./RolesManager";
import { ChevronDown, Settings2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  assumptions: Assumptions;
  onChange: (a: Assumptions) => void;
  onAddRole: (label?: string, rate?: number) => void;
  onRemoveRole: (id: string) => void;
  onUpdateRole: (id: string, updates: Partial<Role>) => void;
}

export function AssumptionsPanel({ assumptions, onChange, onAddRole, onRemoveRole, onUpdateRole }: Props) {
  const [open, setOpen] = useState(false);

  const set = <K extends keyof Assumptions>(key: K, val: Assumptions[K]) => {
    onChange({ ...assumptions, [key]: val });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card-hover/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Assumptions & Roles</span>
          <span className="text-xs text-muted ml-1">
            {assumptions.roles.length} roles · {assumptions.currency}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 space-y-5 border-t border-border pt-4">
              <RolesManager
                roles={assumptions.roles}
                onAddRole={onAddRole}
                onRemoveRole={onRemoveRole}
                onUpdateRole={onUpdateRole}
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Global Parameters</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <NumField label="Hours/Week" value={assumptions.hoursPerWeek} onChange={(v) => set("hoursPerWeek", v)} />
                  <NumField label="Loaded Multiplier" value={assumptions.loadedMultiplier} onChange={(v) => set("loadedMultiplier", v)} step={0.1} />
                  <NumField label="Annual Tool Cost" value={assumptions.annualToolCost} onChange={(v) => set("annualToolCost", v)} />
                  <div>
                    <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">Currency</label>
                    <select
                      value={assumptions.currency}
                      onChange={(e) => set("currency", e.target.value as Currency)}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NumField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-muted mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
