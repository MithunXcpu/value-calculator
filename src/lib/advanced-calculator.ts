import { Assumptions, Stage, AdvancedMetrics } from "./types";
import { calculateSummary } from "./calculator";

/**
 * NPV — Net Present Value
 * Σ(CF_t / (1 + r)^t) for t = 1..n
 * CF includes annual savings minus annual tool cost
 */
export function calculateNPV(
  annualSavings: number,
  annualCost: number,
  discountRate: number,
  years: number
): number {
  // Ramp-up factors: 70% year 1, 100% year 2, 107% year 3+
  const rampFactors = [0.7, 1.0, 1.07, 1.1, 1.12];
  let npv = 0;
  for (let t = 1; t <= years; t++) {
    const ramp = rampFactors[Math.min(t - 1, rampFactors.length - 1)];
    const cashFlow = annualSavings * ramp - annualCost;
    npv += cashFlow / Math.pow(1 + discountRate, t);
  }
  return npv;
}

/**
 * IRR — Internal Rate of Return
 * Binary search for the discount rate where NPV = 0
 * Returns rate as decimal (0.25 = 25%)
 */
export function calculateIRR(
  annualSavings: number,
  annualCost: number,
  years: number,
  maxIterations = 100,
  tolerance = 0.0001
): number {
  // Edge: no savings means IRR is meaningless
  if (annualSavings <= 0 || annualCost <= 0) return 0;

  let low = -0.5;
  let high = 10.0; // 1000% IRR cap
  let mid = 0;

  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    const npv = calculateNPV(annualSavings, annualCost, mid, years);

    if (Math.abs(npv) < tolerance) return mid;
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return mid;
}

/**
 * TCO — Total Cost of Ownership
 * Includes tool cost, estimated implementation, and training
 * Implementation = 15% of year 1 cost (one-time)
 * Training = 5% of year 1 cost (one-time)
 */
export function calculateTCO(
  annualCost: number,
  years: number,
  implementationPct = 0.15,
  trainingPct = 0.05
): number {
  const implementation = annualCost * implementationPct;
  const training = annualCost * trainingPct;
  return annualCost * years + implementation + training;
}

/**
 * Break-even — months until cumulative savings exceed cumulative costs
 * Accounts for ramp-up in year 1
 */
export function calculateBreakEven(
  annualSavings: number,
  annualCost: number,
  implementationPct = 0.15,
  trainingPct = 0.05
): number {
  if (annualSavings <= 0) return Infinity;

  const implementation = annualCost * implementationPct;
  const training = annualCost * trainingPct;
  const upfrontCost = implementation + training;

  // Monthly savings with ramp: 70% efficiency in year 1
  const monthlySavingsY1 = (annualSavings * 0.7) / 12;
  const monthlyCost = annualCost / 12;

  let cumulativeSavings = 0;
  let cumulativeCost = upfrontCost;

  for (let month = 1; month <= 60; month++) {
    const ramp = month <= 12 ? 0.7 : month <= 24 ? 1.0 : 1.07;
    cumulativeSavings += (annualSavings * ramp) / 12;
    cumulativeCost += monthlyCost;

    if (cumulativeSavings >= cumulativeCost) {
      return month;
    }
  }

  return 60; // Cap at 5 years
}

/**
 * Calculate all advanced metrics from stages + assumptions
 */
export function calculateAdvancedMetrics(
  stages: Stage[],
  assumptions: Assumptions,
  discountRate = 0.1
): AdvancedMetrics {
  const summary = calculateSummary(stages, assumptions);
  const annualSavings = summary.totalCostSaved;
  const annualCost = assumptions.annualToolCost;

  const npv = calculateNPV(annualSavings, annualCost, discountRate, 5);
  const irr = calculateIRR(annualSavings, annualCost, 5);
  const tco = calculateTCO(annualCost, 5);
  const breakEvenMonths = calculateBreakEven(annualSavings, annualCost);

  // Year 4 and 5 projections (110% and 112% ramp)
  const year4 = annualSavings * 1.1;
  const year5 = annualSavings * 1.12;

  return { npv, irr, tco, breakEvenMonths, year4, year5 };
}

/**
 * Format IRR as percentage string
 */
export function formatIRR(irr: number): string {
  if (!isFinite(irr) || irr > 9.99) return ">999%";
  return `${(irr * 100).toFixed(0)}%`;
}

/**
 * Sensitivity analysis — recalculate metrics across a range of discount rates
 */
export function sensitivityAnalysis(
  stages: Stage[],
  assumptions: Assumptions,
  rates: number[] = [0.05, 0.08, 0.1, 0.12, 0.15, 0.2]
): Array<{ rate: number; npv: number; irr: number; breakEvenMonths: number }> {
  return rates.map((rate) => {
    const metrics = calculateAdvancedMetrics(stages, assumptions, rate);
    return { rate, npv: metrics.npv, irr: metrics.irr, breakEvenMonths: metrics.breakEvenMonths };
  });
}
