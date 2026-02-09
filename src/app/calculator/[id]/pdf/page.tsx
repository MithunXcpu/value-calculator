"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calculator } from "@/lib/types";
import { getCalculator } from "@/lib/storage";
import { calculateSummary, calculateStage, formatCurrency, getRoleById } from "@/lib/calculator";
import { calculateAdvancedMetrics, formatIRR } from "@/lib/advanced-calculator";
import Link from "next/link";
import { ArrowLeft, Printer, ShieldAlert, Code2, Scale, Smile, Star, Target } from "lucide-react";

export default function PDFPreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const [calc, setCalc] = useState<Calculator | null>(null);

  useEffect(() => {
    setCalc(getCalculator(id));
  }, [id]);

  if (!calc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  const summary = calculateSummary(calc.stages, calc.assumptions);
  const advanced = calculateAdvancedMetrics(calc.stages, calc.assumptions);
  const sym = { USD: "$", GBP: "\u00a3", EUR: "\u20ac" }[calc.assumptions.currency] || "$";
  const companyName = calc.clientCompany?.name || "Your Organization";
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const hasProductAnalysis = !!calc.productAnalysis;

  const defaultNextSteps = [
    "Schedule technical deep-dive with stakeholders to validate assumptions",
    "Run a 30-day pilot program with the first two use cases",
    "Build implementation roadmap with milestones and success criteria",
  ];
  const nextSteps = calc.nextSteps?.length ? calc.nextSteps : defaultNextSteps;

  const fiveYearTotal = summary.year1 + summary.year2 + summary.year3 + advanced.year4 + advanced.year5;

  return (
    <div>
      {/* Navigation Bar */}
      <div className="max-w-5xl mx-auto px-4 py-6 no-print">
        <div className="flex items-center justify-between">
          <Link href={`/calculator/${id}`} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Calculator
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* === PAGE 1: COVER === */}
      <div className="print-page">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden print:rounded-none print:shadow-none" style={{ minHeight: "842px" }}>
            <div className="flex flex-col items-center justify-center h-full px-12 py-20" style={{ minHeight: "842px" }}>
              {/* Company Logo */}
              {calc.clientCompany?.logoUrl ? (
                <img
                  src={calc.clientCompany.logoUrl}
                  alt={companyName}
                  className="w-24 h-24 object-contain mb-10"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mb-10">
                  <span className="text-3xl font-bold text-blue-600">{companyName.charAt(0)}</span>
                </div>
              )}

              {/* Title Block */}
              <div className="text-center max-w-lg">
                <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
                  Value Assessment
                </div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{calc.name}</h1>
                <div className="w-16 h-0.5 bg-blue-500 mx-auto mb-6" />
                <p className="text-lg text-gray-500">
                  Prepared for <span className="font-semibold text-gray-700">{companyName}</span>
                </p>
                <p className="text-sm text-gray-400 mt-3">{today}</p>
                <p className="text-xs text-gray-300 mt-6">Prepared by Mithun Manjunatha</p>
              </div>

              {/* Product Analysis Summary (if available) */}
              {hasProductAnalysis && calc.productAnalysis && (
                <div className="mt-8 max-w-md text-center">
                  <p className="text-sm text-gray-500 leading-relaxed">{calc.productAnalysis.description}</p>
                  {calc.productAnalysis.features.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                      {calc.productAnalysis.features.slice(0, 5).map((f, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom ROI Teaser */}
              <div className="mt-auto pt-16">
                <div className="flex items-center gap-8 text-center">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Projected ROI</p>
                    <p className="text-3xl font-bold text-blue-600">{summary.roi.toFixed(2)}x</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Annual Savings</p>
                    <p className="text-3xl font-bold text-emerald-600">{formatCurrency(summary.totalCostSaved, calc.assumptions.currency)}</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payback</p>
                    <p className="text-3xl font-bold text-gray-700">{summary.paybackMonths.toFixed(1)} mo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === PAGE 2: EXECUTIVE SUMMARY === */}
      <div className="print-page">
        <div className="max-w-5xl mx-auto px-4 mt-8 print:mt-0">
          <div className="bg-white rounded-2xl overflow-hidden print:rounded-none print:shadow-none" style={{ minHeight: "842px" }}>
            <div className="px-12 py-12">
              <SlideHeader title="Executive Summary" subtitle="Key financial metrics and projected impact" pageNum={2} />

              {/* Hero Metrics — 3x2 grid with advanced metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <MetricHero
                  label="Return on Investment"
                  value={`${summary.roi.toFixed(2)}x`}
                  description={`Every ${sym}1 invested returns ${sym}${summary.roi.toFixed(2)}`}
                  color="blue"
                />
                <MetricHero
                  label="Payback Period"
                  value={`${summary.paybackMonths.toFixed(1)} months`}
                  description="Time to recover the full tool investment"
                  color="gray"
                />
                <MetricHero
                  label="Annual Savings"
                  value={formatCurrency(summary.totalCostSaved, calc.assumptions.currency)}
                  description={`${summary.totalSavedHours.toFixed(0)} hours recaptured per year`}
                  color="green"
                />
                <MetricHero
                  label="Net Present Value (5yr)"
                  value={formatCurrency(advanced.npv, calc.assumptions.currency)}
                  description="NPV at 10% discount rate over 5 years"
                  color={advanced.npv > 0 ? "green" : "red"}
                />
                <MetricHero
                  label="Internal Rate of Return"
                  value={formatIRR(advanced.irr)}
                  description="Effective annual return on this investment"
                  color="blue"
                />
                <MetricHero
                  label="Cost of Delay"
                  value={`${formatCurrency(summary.costOfDelay, calc.assumptions.currency)}/mo`}
                  description="Lost value for every month of inaction"
                  color="red"
                />
              </div>

              {/* TCO vs Value comparison */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">5-Year Total Cost of Ownership</p>
                  <p className="text-2xl font-bold text-gray-700">{formatCurrency(advanced.tco, calc.assumptions.currency)}</p>
                  <p className="text-xs text-gray-400 mt-1">Includes tool, implementation & training</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">5-Year Total Value</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatCurrency(fiveYearTotal, calc.assumptions.currency)}</p>
                  <p className="text-xs text-emerald-500 mt-1">
                    {(fiveYearTotal / advanced.tco).toFixed(1)}x return on total cost
                  </p>
                </div>
              </div>

              {/* Why This Matters */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Why This Matters</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Based on analysis across {calc.stages.length} operational areas affecting {calc.assumptions.roles.length} role
                  {calc.assumptions.roles.length > 1 ? "s" : ""}, this assessment identifies{" "}
                  <span className="font-semibold text-gray-900">{summary.totalSavedHours.toFixed(0)} hours</span> of annual time savings,
                  translating to <span className="font-semibold text-emerald-700">{formatCurrency(summary.totalCostSaved, calc.assumptions.currency)}</span> in
                  cost reduction. With an IRR of <span className="font-semibold text-gray-900">{formatIRR(advanced.irr)}</span> and break-even
                  at <span className="font-semibold text-gray-900">{advanced.breakEvenMonths} months</span>,
                  the investment pays for itself rapidly. Delaying costs {companyName} approximately{" "}
                  <span className="font-semibold text-red-600">{formatCurrency(summary.costOfDelay, calc.assumptions.currency)} every month</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === PAGE 3: USE CASE & APPROACH === */}
      <div className="print-page">
        <div className="max-w-5xl mx-auto px-4 mt-8 print:mt-0">
          <div className="bg-white rounded-2xl overflow-hidden print:rounded-none print:shadow-none" style={{ minHeight: "842px" }}>
            <div className="px-12 py-12">
              <SlideHeader title="Use Cases & Approach" subtitle="Targeted operational improvements across the organization" pageNum={3} />

              {/* Product Context (if available) */}
              {hasProductAnalysis && calc.productAnalysis && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{calc.productAnalysis.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{calc.productAnalysis.description}</p>
                      {calc.productAnalysis.targetUsers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {calc.productAnalysis.targetUsers.slice(0, 4).map((u, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/70 rounded text-xs text-gray-600">{u}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Roles Legend */}
              <div className="flex flex-wrap gap-3 mb-8">
                {calc.assumptions.roles.map((role) => (
                  <div key={role.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-gray-700">{role.label}</span>
                    <span className="text-xs text-gray-400">{sym}{role.hourlyRate}/hr</span>
                  </div>
                ))}
              </div>

              {/* Stages Timeline */}
              <div className="space-y-0">
                {calc.stages.map((stage, i) => {
                  const stageCalc = calculateStage(stage, calc.assumptions);
                  return (
                    <div key={stage.id} className="flex gap-5">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        {i < calc.stages.length - 1 && <div className="w-0.5 flex-1 bg-blue-100 my-1" />}
                      </div>

                      {/* Stage Content */}
                      <div className={`flex-1 ${i < calc.stages.length - 1 ? "pb-6" : "pb-2"}`}>
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-base font-bold text-gray-900">{stage.name}</h4>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              {stageCalc.totalSaved.toFixed(1)} hrs saved
                            </span>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              {formatCurrency(stageCalc.costSaved, calc.assumptions.currency)}
                            </span>
                          </div>
                        </div>
                        {stage.rationale && (
                          <p className="text-sm text-gray-500 mb-2">{stage.rationale}</p>
                        )}
                        {/* Per-role breakdown mini */}
                        <div className="flex flex-wrap gap-3">
                          {stage.roleAllocations.map((alloc) => {
                            const role = getRoleById(calc.assumptions.roles, alloc.roleId);
                            if (!role) return null;
                            const saved = alloc.baseline * (alloc.gain / 100);
                            return (
                              <span key={alloc.roleId} className="text-xs text-gray-400">
                                {role.label}: {alloc.baseline}h → {(alloc.baseline - saved).toFixed(1)}h ({alloc.gain}% reduction)
                              </span>
                            );
                          })}
                        </div>
                        {stage.softBenefits && stage.softBenefits.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {stage.softBenefits.map((sb) => (
                              <span key={sb.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                                <SoftBenefitPdfIcon type={sb.type} />
                                {sb.label} ({sb.impactPct}%)
                              </span>
                            ))}
                          </div>
                        )}
                        {stage.assumptions && (
                          <p className="text-xs text-gray-400 mt-1 italic">Assumption: {stage.assumptions}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === PAGE 4: DETAILED BREAKDOWN === */}
      <div className="print-page">
        <div className="max-w-5xl mx-auto px-4 mt-8 print:mt-0">
          <div className="bg-white rounded-2xl overflow-hidden print:rounded-none print:shadow-none" style={{ minHeight: "842px" }}>
            <div className="px-12 py-12">
              <SlideHeader title="Detailed Breakdown" subtitle="Hours and cost savings by stage and role" pageNum={4} />

              {/* Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Baseline</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">After</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours Saved</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.stages.map((stage) => {
                      const c = calculateStage(stage, calc.assumptions);
                      const totalBaseline = stage.roleAllocations.reduce((s, a) => s + a.baseline, 0);
                      const totalAfter = c.roleResults.reduce((s, r) => s + r.after, 0);
                      return (
                        <tr key={stage.id} className="border-b border-gray-100">
                          <td className="py-3 font-medium text-gray-900">{stage.name}</td>
                          <td className="py-3 text-right text-gray-500">{totalBaseline.toFixed(0)} hrs</td>
                          <td className="py-3 text-right text-gray-500">{totalAfter.toFixed(1)} hrs</td>
                          <td className="py-3 text-right text-emerald-700 font-medium">{c.totalSaved.toFixed(1)} hrs</td>
                          <td className="py-3 text-right text-emerald-700 font-bold">{formatCurrency(c.costSaved, calc.assumptions.currency)}</td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td className="py-3 text-gray-900">Total</td>
                      <td className="py-3 text-right text-gray-900">{summary.totalBaseline.toFixed(0)} hrs</td>
                      <td className="py-3 text-right text-gray-900">{summary.totalAfter.toFixed(1)} hrs</td>
                      <td className="py-3 text-right text-emerald-700">{summary.totalSavedHours.toFixed(1)} hrs</td>
                      <td className="py-3 text-right text-emerald-700">{formatCurrency(summary.totalCostSaved, calc.assumptions.currency)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Role Rates Reference */}
              <div className="bg-gray-50 rounded-xl p-5 mb-8">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assumptions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {calc.assumptions.roles.map((role) => (
                    <div key={role.id}>
                      <span className="text-gray-500">{role.label}:</span>{" "}
                      <span className="font-medium text-gray-900">{sym}{role.hourlyRate}/hr</span>
                    </div>
                  ))}
                  <div>
                    <span className="text-gray-500">Loaded Multiplier:</span>{" "}
                    <span className="font-medium text-gray-900">{calc.assumptions.loadedMultiplier}x</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Annual Tool Cost:</span>{" "}
                    <span className="font-medium text-gray-900">{formatCurrency(calc.assumptions.annualToolCost, calc.assumptions.currency)}</span>
                  </div>
                </div>
              </div>

              {/* 5-Year Projection */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">5-Year Value Projection</h4>
                <div className="grid grid-cols-5 gap-3">
                  <ProjectionBox label="Year 1" value={formatCurrency(summary.year1, calc.assumptions.currency)} sub="70% ramp-up" />
                  <ProjectionBox label="Year 2" value={formatCurrency(summary.year2, calc.assumptions.currency)} sub="Full adoption" highlight />
                  <ProjectionBox label="Year 3" value={formatCurrency(summary.year3, calc.assumptions.currency)} sub="107% gains" />
                  <ProjectionBox label="Year 4" value={formatCurrency(advanced.year4, calc.assumptions.currency)} sub="110% gains" />
                  <ProjectionBox label="Year 5" value={formatCurrency(advanced.year5, calc.assumptions.currency)} sub="112% gains" />
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  5-Year Total Value: <span className="font-bold text-gray-700">{formatCurrency(fiveYearTotal, calc.assumptions.currency)}</span>
                  {" "}&middot;{" "}
                  5-Year TCO: <span className="font-bold text-gray-700">{formatCurrency(advanced.tco, calc.assumptions.currency)}</span>
                  {" "}&middot;{" "}
                  Net Return: <span className="font-bold text-emerald-700">{formatCurrency(fiveYearTotal - advanced.tco, calc.assumptions.currency)}</span>
                </p>
              </div>

              {/* Soft Benefits Summary */}
              {(() => {
                const allBenefits = calc.stages.flatMap((s) =>
                  (s.softBenefits || []).map((sb) => ({ ...sb, stage: s.name }))
                );
                if (allBenefits.length === 0) return null;
                return (
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Strategic Benefits (Non-Financial)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {allBenefits.map((sb, i) => (
                        <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <SoftBenefitPdfIcon type={sb.type} />
                            <span className="text-xs font-semibold text-gray-900">{sb.label}</span>
                            <span className="ml-auto text-xs font-bold text-amber-700">{sb.impactPct}%</span>
                          </div>
                          {sb.description && <p className="text-xs text-gray-500 leading-relaxed">{sb.description}</p>}
                          <p className="text-xs text-gray-400 mt-0.5 italic">{sb.stage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* === PAGE 5: COST OF DELAY & NEXT STEPS === */}
      <div className="print-page">
        <div className="max-w-5xl mx-auto px-4 mt-8 print:mt-0">
          <div className="bg-white rounded-2xl overflow-hidden print:rounded-none print:shadow-none" style={{ minHeight: "842px" }}>
            <div className="px-12 py-12 flex flex-col" style={{ minHeight: "842px" }}>
              <SlideHeader title="Cost of Delay & Next Steps" subtitle="The financial impact of waiting and recommended actions" pageNum={5} />

              {/* Cost of Delay */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-8 mb-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Cost of Delay</h3>
                    <p className="text-3xl font-bold text-red-600 mb-3">
                      {formatCurrency(summary.costOfDelay, calc.assumptions.currency)} <span className="text-base font-normal text-red-400">per month</span>
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Every month that {companyName} delays implementation, approximately{" "}
                      <span className="font-semibold">{formatCurrency(summary.costOfDelay, calc.assumptions.currency)}</span> in potential savings
                      is lost. Over a quarter, this compounds to{" "}
                      <span className="font-semibold">{formatCurrency(summary.costOfDelay * 3, calc.assumptions.currency)}</span> in unrealized
                      value. These savings represent real productivity hours that could be redirected toward higher-impact initiatives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delay Impact Table */}
              <div className="grid grid-cols-4 gap-3 mb-10">
                {[1, 3, 6, 12].map((months) => (
                  <div key={months} className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      {months === 1 ? "1 Month" : `${months} Months`}
                    </p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(summary.costOfDelay * months, calc.assumptions.currency)}</p>
                    <p className="text-xs text-gray-400">lost</p>
                  </div>
                ))}
              </div>

              {/* Next Steps */}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Recommended Next Steps</h3>
                <div className="space-y-4">
                  {nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-10 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Confidential — Prepared by Mithun Manjunatha using Value Calculator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Sub-Components === */

function SlideHeader({ title, subtitle, pageNum }: { title: string; subtitle: string; pageNum: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-300 font-mono">{pageNum}/5</span>
      </div>
      <p className="text-sm text-gray-400">{subtitle}</p>
      <div className="w-12 h-0.5 bg-blue-500 mt-3" />
    </div>
  );
}

function MetricHero({ label, value, description, color }: { label: string; value: string; description: string; color: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
    green: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    gray: { bg: "bg-gray-50", text: "text-gray-900", border: "border-gray-100" },
  };
  const c = colors[color] || colors.gray;

  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4`}>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${c.text} mb-1`}>{value}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}

function SoftBenefitPdfIcon({ type }: { type: string }) {
  const cls = "w-3 h-3";
  switch (type) {
    case "risk_exposure": return <ShieldAlert className={cls} />;
    case "tech_debt": return <Code2 className={cls} />;
    case "compliance": return <Scale className={cls} />;
    case "employee_satisfaction": return <Smile className={cls} />;
    case "brand_reputation": return <Star className={cls} />;
    default: return <Target className={cls} />;
  }
}

function ProjectionBox({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center ${highlight ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-100"}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-emerald-700" : "text-gray-900"}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
