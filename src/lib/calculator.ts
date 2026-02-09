import { Assumptions, Currency, Role, Stage, StageCalculation, Summary } from "./types";

export function getRoleById(roles: Role[], roleId: string): Role | undefined {
  return roles.find((r) => r.id === roleId);
}

export function calculateStage(stage: Stage, assumptions: Assumptions): StageCalculation {
  const roleResults = stage.roleAllocations.map((alloc) => {
    const role = getRoleById(assumptions.roles, alloc.roleId);
    const rate = role?.hourlyRate ?? 0;
    const after = alloc.baseline * (1 - alloc.gain / 100);
    const saved = alloc.baseline - after;
    const costSaved = saved * rate * assumptions.loadedMultiplier;
    return { roleId: alloc.roleId, baseline: alloc.baseline, after, saved, costSaved };
  });

  const totalSaved = roleResults.reduce((sum, r) => sum + r.saved, 0);
  const costSaved = roleResults.reduce((sum, r) => sum + r.costSaved, 0);

  return { roleResults, totalSaved, costSaved };
}

export function calculateSummary(stages: Stage[], assumptions: Assumptions): Summary {
  const calculations = stages.map((s) => calculateStage(s, assumptions));

  const totalBaseline = stages.reduce(
    (sum, s) => sum + s.roleAllocations.reduce((rs, a) => rs + a.baseline, 0),
    0
  );
  const totalAfter = calculations.reduce(
    (sum, c) => sum + c.roleResults.reduce((rs, r) => rs + r.after, 0),
    0
  );
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
  const symbols: Record<string, string> = { USD: "$", GBP: "\u00a3", EUR: "\u20ac" };
  const sym = symbols[currency] || "$";
  return `${sym}${Math.round(value).toLocaleString()}`;
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}
