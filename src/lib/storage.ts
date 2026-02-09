import { Calculator, WhiteLabelSettings, LegacyCalculator, Role, RoleAllocation } from "./types";

const CALCULATORS_KEY = "vc_calculators";
const SETTINGS_KEY = "vc_settings";
const CURRENT_SCHEMA_VERSION = 3;

function isLegacyCalculator(calc: unknown): calc is LegacyCalculator {
  const c = calc as Record<string, unknown>;
  if (!c || typeof c !== "object") return false;
  const assumptions = c.assumptions as Record<string, unknown> | undefined;
  return assumptions !== undefined && "roleALabel" in assumptions && !("roles" in assumptions);
}

function isV2Calculator(calc: unknown): boolean {
  const c = calc as Record<string, unknown>;
  if (!c || typeof c !== "object") return false;
  return (c.schemaVersion === 2 || (!c.schemaVersion && "roles" in (c.assumptions as Record<string, unknown>)));
}

function migrateV1toV2(legacy: LegacyCalculator): Calculator {
  const roleA: Role = { id: crypto.randomUUID(), label: legacy.assumptions.roleALabel, hourlyRate: legacy.assumptions.rateA };
  const roleB: Role = { id: crypto.randomUUID(), label: legacy.assumptions.roleBLabel, hourlyRate: legacy.assumptions.rateB };

  return {
    id: legacy.id,
    name: legacy.name,
    createdAt: legacy.createdAt,
    updatedAt: legacy.updatedAt,
    schemaVersion: 2,
    assumptions: {
      roles: [roleA, roleB],
      hoursPerWeek: legacy.assumptions.hoursPerWeek,
      loadedMultiplier: legacy.assumptions.loadedMultiplier,
      annualToolCost: legacy.assumptions.annualToolCost,
      currency: legacy.assumptions.currency,
    },
    stages: legacy.stages.map((s) => ({
      id: s.id,
      name: s.name,
      roleAllocations: [
        { roleId: roleA.id, baseline: s.baselineA, gain: s.gainA } as RoleAllocation,
        { roleId: roleB.id, baseline: s.baselineB, gain: s.gainB } as RoleAllocation,
      ],
      assumptions: s.assumptions,
      rationale: s.rationale,
      peopleAffected: s.peopleAffected,
      workflow: s.workflow,
    })),
  };
}

function migrateV2toV3(calc: Calculator): Calculator {
  return {
    ...calc,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    // v3 adds optional fields — no data transformation needed
    // productAnalysis, wizardState are undefined for existing calcs
  };
}

export function migrateCalculator(raw: unknown): Calculator {
  let calc: Calculator;

  // v1 → v2
  if (isLegacyCalculator(raw)) {
    calc = migrateV1toV2(raw);
  } else {
    calc = raw as Calculator;
  }

  // v2 → v3
  if (!calc.schemaVersion || calc.schemaVersion < CURRENT_SCHEMA_VERSION) {
    calc = migrateV2toV3(calc);
  }

  return calc;
}

export function getCalculators(): Calculator[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CALCULATORS_KEY);
  if (!data) return [];
  const rawList = JSON.parse(data) as unknown[];
  return rawList.map((raw) => migrateCalculator(raw));
}

export function getCalculator(id: string): Calculator | null {
  const calcs = getCalculators();
  return calcs.find((c) => c.id === id) || null;
}

export function saveCalculator(calc: Calculator): void {
  const calcs = getCalculators();
  const idx = calcs.findIndex((c) => c.id === calc.id);
  const updated = { ...calc, updatedAt: new Date().toISOString(), schemaVersion: CURRENT_SCHEMA_VERSION };
  if (idx >= 0) {
    calcs[idx] = updated;
  } else {
    calcs.push(updated);
  }
  localStorage.setItem(CALCULATORS_KEY, JSON.stringify(calcs));
}

export function deleteCalculator(id: string): void {
  const calcs = getCalculators().filter((c) => c.id !== id);
  localStorage.setItem(CALCULATORS_KEY, JSON.stringify(calcs));
}

export function duplicateCalculator(id: string): Calculator | null {
  const calc = getCalculator(id);
  if (!calc) return null;
  const newCalc: Calculator = {
    ...calc,
    id: crypto.randomUUID(),
    name: `${calc.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveCalculator(newCalc);
  return newCalc;
}

export function getWhiteLabelSettings(): WhiteLabelSettings {
  if (typeof window === "undefined") return { companyName: "", logoBase64: "", primaryColor: "#3b82f6", accentColor: "#10b981" };
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { companyName: "", logoBase64: "", primaryColor: "#3b82f6", accentColor: "#10b981" };
}

export function saveWhiteLabelSettings(settings: WhiteLabelSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
