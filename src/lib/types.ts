export type Currency = "USD" | "GBP" | "EUR";

export interface Role {
  id: string;
  label: string;
  hourlyRate: number;
}

export interface RoleAllocation {
  roleId: string;
  baseline: number;
  gain: number;
}

export interface Assumptions {
  roles: Role[];
  hoursPerWeek: number;
  loadedMultiplier: number;
  annualToolCost: number;
  currency: Currency;
}

export type SoftBenefitType = "risk_exposure" | "tech_debt" | "compliance" | "employee_satisfaction" | "brand_reputation" | "other";

export interface SoftBenefit {
  id: string;
  type: SoftBenefitType;
  label: string;
  description: string;
  impactPct: number; // 0-100 percentage effect
  rationale: string;
}

export const SOFT_BENEFIT_LABELS: Record<SoftBenefitType, string> = {
  risk_exposure: "Risk Exposure Reduction",
  tech_debt: "Tech Debt Reduction",
  compliance: "Compliance Impact",
  employee_satisfaction: "Employee Satisfaction",
  brand_reputation: "Brand & Reputation",
  other: "Other Benefit",
};

export interface Stage {
  id: string;
  name: string;
  roleAllocations: RoleAllocation[];
  assumptions: string;
  rationale: string;
  peopleAffected: number;
  workflow: string;
  softBenefits?: SoftBenefit[];
}

export interface RoleResult {
  roleId: string;
  baseline: number;
  after: number;
  saved: number;
  costSaved: number;
}

export interface StageCalculation {
  roleResults: RoleResult[];
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

export interface ClientCompany {
  name: string;
  ticker?: string;
  logoUrl?: string;
}

export interface ProductAnalysis {
  name: string;
  description: string;
  features: string[];
  targetUsers: string[];
  painPoints: string[];
  sourceUrl?: string;
  analyzedAt: string;
}

export interface WizardState {
  currentStep: number;
  isComplete: boolean;
}

export interface AdvancedMetrics {
  npv: number;
  irr: number;
  tco: number;
  breakEvenMonths: number;
  year4: number;
  year5: number;
}

export interface Calculator {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  assumptions: Assumptions;
  stages: Stage[];
  schemaVersion: number;
  clientCompany?: ClientCompany;
  nextSteps?: string[];
  productAnalysis?: ProductAnalysis;
  wizardState?: WizardState;
}

export interface WhiteLabelSettings {
  companyName: string;
  logoBase64: string;
  primaryColor: string;
  accentColor: string;
}

// Legacy types for migration
export interface LegacyAssumptions {
  roleALabel: string;
  roleBLabel: string;
  rateA: number;
  rateB: number;
  hoursPerWeek: number;
  loadedMultiplier: number;
  annualToolCost: number;
  currency: Currency;
}

export interface LegacyStage {
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

export interface LegacyCalculator {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  assumptions: LegacyAssumptions;
  stages: LegacyStage[];
}
