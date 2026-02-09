"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calculator } from "@/lib/types";
import { getCalculator } from "@/lib/storage";
import { calculateSummary, calculateStage, formatCurrency } from "@/lib/calculator";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function PDFPreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const [calc, setCalc] = useState<Calculator | null>(null);

  useEffect(() => {
    setCalc(getCalculator(id));
  }, [id]);

  if (!calc) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;

  const summary = calculateSummary(calc.stages, calc.assumptions);
  const sym = { USD: "$", GBP: "\u00a3", EUR: "\u20ac" }[calc.assumptions.currency] || "$";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 no-print">
        <Link href={`/calculator/${id}`} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      <div className="bg-white text-gray-900 rounded-xl p-8 space-y-8 print:shadow-none print:rounded-none">
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">{calc.name}</h1>
          <p className="text-sm text-gray-500 mt-2">Generated {new Date().toLocaleDateString()} | Value Calculator by Mithun</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="ROI" value={`${summary.roi.toFixed(2)}x`} highlight />
          <StatBox label="Payback Period" value={`${summary.paybackMonths.toFixed(1)} months`} />
          <StatBox label="Cost of Delay" value={`${formatCurrency(summary.costOfDelay, calc.assumptions.currency)}/mo`} />
          <StatBox label="Hours Saved" value={`${summary.totalSavedHours.toFixed(0)} hrs/year`} />
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2 text-gray-900">Assumptions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">{calc.assumptions.roleALabel} Rate:</span> {sym}{calc.assumptions.rateA}/hr</div>
            <div><span className="text-gray-500">{calc.assumptions.roleBLabel} Rate:</span> {sym}{calc.assumptions.rateB}/hr</div>
            <div><span className="text-gray-500">Loaded Multiplier:</span> {calc.assumptions.loadedMultiplier}x</div>
            <div><span className="text-gray-500">Annual Tool Cost:</span> {formatCurrency(calc.assumptions.annualToolCost, calc.assumptions.currency)}</div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 text-gray-900">Detailed Breakdown</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2">Stage</th>
                <th className="py-2 text-right">Baseline</th>
                <th className="py-2 text-right">After</th>
                <th className="py-2 text-right">Saved</th>
                <th className="py-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {calc.stages.map((stage) => {
                const c = calculateStage(stage, calc.assumptions);
                return (
                  <tr key={stage.id} className="border-b border-gray-100">
                    <td className="py-2 font-medium">{stage.name}</td>
                    <td className="py-2 text-right text-gray-500">{(stage.baselineA + stage.baselineB).toFixed(0)} hrs</td>
                    <td className="py-2 text-right text-gray-500">{(c.afterA + c.afterB).toFixed(1)} hrs</td>
                    <td className="py-2 text-right text-green-700 font-medium">{c.totalSaved.toFixed(1)} hrs</td>
                    <td className="py-2 text-right text-green-700 font-bold">{formatCurrency(c.costSaved, calc.assumptions.currency)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 font-bold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right">{summary.totalBaseline.toFixed(0)} hrs</td>
                <td className="py-2 text-right">{summary.totalAfter.toFixed(1)} hrs</td>
                <td className="py-2 text-right text-green-700">{summary.totalSavedHours.toFixed(1)} hrs</td>
                <td className="py-2 text-right text-green-700">{formatCurrency(summary.totalCostSaved, calc.assumptions.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 text-gray-900">3-Year Projection</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Year 1 (70%)</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(summary.year1, calc.assumptions.currency)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Year 2 (100%)</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(summary.year2, calc.assumptions.currency)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Year 3 (107%)</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(summary.year3, calc.assumptions.currency)}</p>
            </div>
          </div>
        </div>

        {calc.stages.some((s) => s.rationale) && (
          <div>
            <h2 className="text-lg font-bold mb-3 text-gray-900">Rationale by Stage</h2>
            <div className="space-y-3">
              {calc.stages.filter((s) => s.rationale).map((s) => (
                <div key={s.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.rationale}</p>
                  {s.assumptions && <p className="text-xs text-gray-400 mt-1">Assumption: {s.assumptions}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-4 text-center ${highlight ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-blue-700" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
