import { Calculator, WhiteLabelSettings } from "./types";

const CALCULATORS_KEY = "vc_calculators";
const SETTINGS_KEY = "vc_settings";

export function getCalculators(): Calculator[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CALCULATORS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getCalculator(id: string): Calculator | null {
  const calcs = getCalculators();
  return calcs.find((c) => c.id === id) || null;
}

export function saveCalculator(calc: Calculator): void {
  const calcs = getCalculators();
  const idx = calcs.findIndex((c) => c.id === calc.id);
  if (idx >= 0) {
    calcs[idx] = { ...calc, updatedAt: new Date().toISOString() };
  } else {
    calcs.push(calc);
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
