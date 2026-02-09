"use client";

import Link from "next/link";
import { Calculator } from "@/lib/types";
import { calculateSummary, formatCurrency } from "@/lib/calculator";
import { Copy, Trash2, Building2 } from "lucide-react";

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
        <Link href={`/calculator/${calc.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            {calc.clientCompany?.logoUrl ? (
              <img
                src={calc.clientCompany.logoUrl}
                alt=""
                className="w-6 h-6 rounded object-contain bg-white p-0.5 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : calc.clientCompany?.name ? (
              <div className="w-6 h-6 rounded bg-primary-subtle flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3 h-3 text-primary" />
              </div>
            ) : null}
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{calc.name}</h3>
          </div>
          <p className="text-xs text-muted">
            {calc.stages.length} stages · {calc.assumptions.roles.length} roles · Updated {new Date(calc.updatedAt).toLocaleDateString()}
          </p>
        </Link>
        <div className="flex gap-1 flex-shrink-0 ml-2">
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
