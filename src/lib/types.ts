export type Currency = "USD" | "GBP" | "EUR";

export interface Assumptions {
  roleALabel: string;
  roleBLabel: string;
  rateA: number;
  rateB: number;
  hoursPerWeek: number;
  loadedMultiplier: number;
  annualToolCost: number;
  currency: Currency;
}

export interface Stage {
  id: string;
  name: string;
  baselineA: number;
  baselineB: number;
  gainA: number;
  gainB: number;
  assumptions: string;
  rationale: string;
  peopleAffected: number;
  workflow: string;
}

export interface StageCalculation {
  afterA: number;
  afterB: number;
  savedA: number;
  savedB: number;
  totalSaved: number;
  costSaved: number;
}

export interface Summary {
  totalBaseline: number;
  totalAfter: number;
  totalSavedHours: number;
  totalCostSaved: number;
  roi: number;
  paybackMonths: number;
  costOfDelay: number;
  year1: number;
  year2: number;
  year3: number;
}

export interface Calculator {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  assumptions: Assumptions;
  stages: Stage[];
}

export interface WhiteLabelSettings {
  companyName: string;
  logoBase64: string;
  primaryColor: string;
  accentColor: string;
}
