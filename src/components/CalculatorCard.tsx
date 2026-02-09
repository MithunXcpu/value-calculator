"use client";

import Link from "next/link";
import { Calculator } from "@/lib/types";
import { calculateSummary, formatCurrency } from "@/lib/calculator";
import { Copy, Trash2, BarChart3 } from "lucide-react";

interface Props {
  calc: Calculator;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function CalculatorCard({ calc, onDuplicate, onDelete }: Props) {
  const summary = calculateSummary(calc.stages, calc.assumptions);
  const roiColor = summary.roi >= 1 ? "text-secondary" : summary.roi >= 0.5 ? "text-warning" : "text-danger";

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <Link href={`/calculator/${calc.id}`} className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{calc.name}</h3>
          <p className="text-xs text-muted mt-1">{calc.stages.length} stages · Updated {new Date(calc.updatedAt).toLocaleDateString()}</p>
        </Link>
        <div className="flex gap-1">
          <button onClick={onDuplicate} className="p-1.5 hover:bg-card-hover rounded-lg text-muted hover:text-foreground transition-colors" title="Duplicate">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-danger/10 rounded-lg text-muted hover:text-danger transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <Link href={`/calculator/${calc.id}`} className="block">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted">ROI</p>
            <p className={`text-lg font-bold ${roiColor}`}>{summary.roi.toFixed(2)}x</p>
          </div>
          <div>
            <p className="text-xs text-muted">Payback</p>
            <p className="text-lg font-bold">{summary.paybackMonths.toFixed(1)} mo</p>
          </div>
          <div>
            <p className="text-xs text-muted">Savings</p>
            <p className="text-lg font-bold text-secondary">{formatCurrency(summary.totalCostSaved, calc.assumptions.currency)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
