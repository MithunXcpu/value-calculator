import { Assumptions, Currency, Stage, StageCalculation, Summary } from "./types";

export function calculateStage(stage: Stage, assumptions: Assumptions): StageCalculation {
  const afterA = stage.baselineA * (1 - stage.gainA / 100);
  const afterB = stage.baselineB * (1 - stage.gainB / 100);
  const savedA = stage.baselineA - afterA;
  const savedB = stage.baselineB - afterB;
  const totalSaved = savedA + savedB;
  const costSaved = (savedA * assumptions.rateA + savedB * assumptions.rateB) * assumptions.loadedMultiplier;

  return { afterA, afterB, savedA, savedB, totalSaved, costSaved };
}

export function calculateSummary(stages: Stage[], assumptions: Assumptions): Summary {
  const calculations = stages.map((s) => calculateStage(s, assumptions));

  const totalBaseline = stages.reduce((sum, s) => sum + s.baselineA + s.baselineB, 0);
  const totalAfter = calculations.reduce((sum, c) => sum + c.afterA + c.afterB, 0);
  const totalSavedHours = calculations.reduce((sum, c) => sum + c.totalSaved, 0);
  const totalCostSaved = calculations.reduce((sum, c) => sum + c.costSaved, 0);

  const roi = assumptions.annualToolCost > 0 ? totalCostSaved / assumptions.annualToolCost : 0;
  const paybackMonths = totalCostSaved > 0 ? (assumptions.annualToolCost / totalCostSaved) * 12 : 0;
  const costOfDelay = totalCostSaved / 12;

  const year1 = totalCostSaved * 0.7;
  const year2 = totalCostSaved * 1.0;
  const year3 = totalCostSaved * 1.07;

  return { totalBaseline, totalAfter, totalSavedHours, totalCostSaved, roi, paybackMonths, costOfDelay, year1, year2, year3 };
}

export function formatCurrency(value: number, currency: Currency = "USD"): string {
  const symbols: Record<string, string> = { USD: "$", GBP: "£", EUR: "€" };
  const sym = symbols[currency] || "$";
  return `${sym}${Math.round(value).toLocaleString()}`;
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

