import { Assumptions, Calculator, Role, Stage } from "./types";

function makeRole(label: string, rate: number): Role {
  return { id: crypto.randomUUID(), label, hourlyRate: rate };
}

function makeStage(
  name: string,
  roleIds: string[],
  allocations: { baseline: number; gain: number }[],
  assumptions: string,
  rationale: string,
  people: number,
  workflow = ""
): Stage {
  return {
    id: crypto.randomUUID(),
    name,
    roleAllocations: allocations.map((a, i) => ({ roleId: roleIds[i], baseline: a.baseline, gain: a.gain })),
    assumptions,
    rationale,
    peopleAffected: people,
    workflow,
  };
}

function buildTemplate(
  name: string,
  description: string,
  roles: Role[],
  stageData: { name: string; allocs: { baseline: number; gain: number }[]; assumptions: string; rationale: string; people: number; workflow?: string }[],
  overrides: Partial<Assumptions> = {}
) {
  const roleIds = roles.map((r) => r.id);
  const assumptions: Assumptions = { roles, hoursPerWeek: 40, loadedMultiplier: 1.3, annualToolCost: 50000, currency: "USD", ...overrides };
  const stages = stageData.map((s) => makeStage(s.name, roleIds, s.allocs, s.assumptions, s.rationale, s.people, s.workflow));
  return { name, description, stages, assumptions };
}

const gcRole = makeRole("General Counsel", 200);
const raRole = makeRole("Risk Analyst", 100);

const riskManagement = buildTemplate("Risk Management", "Model ROI for risk management software based on GRC workflow stages.", [gcRole, raRole], [
  { name: "Identify Existing Risks", allocs: [{ baseline: 15, gain: 60 }, { baseline: 20, gain: 50 }], assumptions: "Current process involves manual spreadsheet reviews", rationale: "AI-powered risk scanning reduces manual identification time", people: 5, workflow: "Manual review of risk registers and documentation" },
  { name: "Workshops to Identify New Risks", allocs: [{ baseline: 10, gain: 40 }, { baseline: 15, gain: 30 }], assumptions: "Quarterly workshops with 8-10 stakeholders", rationale: "Pre-populated risk libraries accelerate workshop prep", people: 10, workflow: "Schedule, prepare, facilitate, and document workshops" },
  { name: "Create/Maintain Risk Register", allocs: [{ baseline: 20, gain: 70 }, { baseline: 25, gain: 60 }], assumptions: "Register maintained in Excel with manual updates", rationale: "Centralized platform with automated workflows", people: 3, workflow: "Manual data entry and cross-referencing" },
  { name: "Educate Risk Owners", allocs: [{ baseline: 8, gain: 50 }, { baseline: 12, gain: 40 }], assumptions: "Training sessions scheduled ad hoc", rationale: "Self-service training modules and automated reminders", people: 15, workflow: "Create training materials and schedule sessions" },
  { name: "Risk Assessment & Review", allocs: [{ baseline: 15, gain: 65 }, { baseline: 20, gain: 55 }], assumptions: "Annual assessment cycle with manual scoring", rationale: "Continuous monitoring with real-time dashboards", people: 8, workflow: "Collect data, score risks, compile reports" },
  { name: "Verify Risks (Monitor)", allocs: [{ baseline: 12, gain: 70 }, { baseline: 18, gain: 65 }], assumptions: "Monthly manual verification checks", rationale: "Automated monitoring with exception-based alerts", people: 4, workflow: "Manual checks against risk indicators" },
  { name: "Reporting", allocs: [{ baseline: 12, gain: 80 }, { baseline: 15, gain: 70 }], assumptions: "Manual Excel report creation for board presentations", rationale: "One-click automated report generation", people: 6, workflow: "Gather data, create charts, format reports" },
  { name: "Ad Hoc Requests", allocs: [{ baseline: 8, gain: 50 }, { baseline: 6, gain: 40 }], assumptions: "Unplanned requests disrupt regular workflow", rationale: "Self-service access reduces ad hoc burden", people: 5, workflow: "Respond to urgent requests from leadership" },
]);

const plRole = makeRole("Project Lead", 150);
const tmRole = makeRole("Team Member", 85);

const softwareROI = buildTemplate("Software ROI", "Justify a software purchase by modeling efficiency gains across evaluation, implementation, training, support, and optimization.", [plRole, tmRole], [
  { name: "Software Evaluation", allocs: [{ baseline: 10, gain: 50 }, { baseline: 15, gain: 40 }], assumptions: "Manual vendor comparison across multiple criteria", rationale: "Structured evaluation framework with scoring templates", people: 4, workflow: "Research vendors, schedule demos, compare features" },
  { name: "Implementation & Setup", allocs: [{ baseline: 20, gain: 60 }, { baseline: 30, gain: 55 }], assumptions: "Custom configuration and data migration required", rationale: "Pre-built templates and automated migration tools", people: 6, workflow: "Configure system, migrate data, set up integrations" },
  { name: "User Training", allocs: [{ baseline: 8, gain: 45 }, { baseline: 20, gain: 50 }], assumptions: "In-person training sessions with manual materials", rationale: "Interactive self-paced learning modules", people: 20, workflow: "Create training content, schedule sessions, track completion" },
  { name: "Ongoing Support", allocs: [{ baseline: 5, gain: 55 }, { baseline: 15, gain: 60 }], assumptions: "Manual ticket handling and troubleshooting", rationale: "AI-assisted support with knowledge base", people: 3, workflow: "Handle support tickets and escalations" },
  { name: "Optimization & Reporting", allocs: [{ baseline: 10, gain: 65 }, { baseline: 12, gain: 50 }], assumptions: "Manual data collection for usage reports", rationale: "Automated analytics dashboards", people: 4, workflow: "Collect metrics, analyze adoption, recommend improvements" },
]);

const peRole = makeRole("Process Engineer", 130);
const osRole = makeRole("Operations Staff", 75);

const processAutomation = buildTemplate("Process Automation", "Calculate savings from automating manual workflows. Covers process mapping through continuous improvement.", [peRole, osRole], [
  { name: "Process Mapping", allocs: [{ baseline: 12, gain: 45 }, { baseline: 18, gain: 40 }], assumptions: "Manual documentation of current workflows", rationale: "Digital process mining and automated mapping", people: 5, workflow: "Interview stakeholders, document steps, identify bottlenecks" },
  { name: "Automation Development", allocs: [{ baseline: 15, gain: 55 }, { baseline: 25, gain: 50 }], assumptions: "Custom scripting and manual integration work", rationale: "Low-code automation builders with pre-built connectors", people: 4, workflow: "Design automation rules, build workflows, configure triggers" },
  { name: "Testing & Validation", allocs: [{ baseline: 8, gain: 50 }, { baseline: 15, gain: 45 }], assumptions: "Manual test cases and validation checks", rationale: "Automated testing frameworks with regression suites", people: 6, workflow: "Create test scenarios, execute tests, validate outputs" },
  { name: "Deployment & Rollout", allocs: [{ baseline: 5, gain: 40 }, { baseline: 12, gain: 35 }], assumptions: "Manual deployment with change management", rationale: "Automated deployment pipelines with rollback capability", people: 10, workflow: "Deploy changes, communicate updates, monitor adoption" },
  { name: "Monitoring & Maintenance", allocs: [{ baseline: 10, gain: 65 }, { baseline: 15, gain: 60 }], assumptions: "Manual monitoring and periodic reviews", rationale: "Real-time monitoring dashboards with automated alerts", people: 3, workflow: "Track performance, identify issues, apply fixes" },
  { name: "Continuous Improvement", allocs: [{ baseline: 8, gain: 50 }, { baseline: 10, gain: 45 }], assumptions: "Ad hoc improvement suggestions", rationale: "Data-driven optimization recommendations", people: 5, workflow: "Analyze metrics, propose improvements, implement changes" },
]);

export const templates = [riskManagement, softwareROI, processAutomation];

export function createCalculatorFromTemplate(templateIdx: number): Calculator {
  const t = templates[templateIdx];
  const roles = t.assumptions.roles.map((r) => ({ ...r, id: crypto.randomUUID() }));
  const roleIdMap = new Map(t.assumptions.roles.map((old, i) => [old.id, roles[i].id]));

  return {
    id: crypto.randomUUID(),
    name: `${t.name} Calculator`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schemaVersion: 3,
    assumptions: { ...t.assumptions, roles },
    stages: t.stages.map((s) => ({
      ...s,
      id: crypto.randomUUID(),
      roleAllocations: s.roleAllocations.map((a) => ({ ...a, roleId: roleIdMap.get(a.roleId) || a.roleId })),
    })),
  };
}

export function createBlankCalculator(): Calculator {
  const roleA = makeRole("Senior Staff", 150);
  const roleB = makeRole("Junior Staff", 75);

  return {
    id: crypto.randomUUID(),
    name: "New Calculator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schemaVersion: 3,
    assumptions: { roles: [roleA, roleB], hoursPerWeek: 40, loadedMultiplier: 1.3, annualToolCost: 50000, currency: "USD" },
    stages: [{
      id: crypto.randomUUID(),
      name: "Stage 1",
      roleAllocations: [{ roleId: roleA.id, baseline: 10, gain: 30 }, { roleId: roleB.id, baseline: 15, gain: 25 }],
      assumptions: "",
      rationale: "",
      peopleAffected: 3,
      workflow: "",
    }],
  };
}

export function createWizardCalculator(): Calculator {
  const roleA = makeRole("Senior Staff", 150);
  const roleB = makeRole("Junior Staff", 75);

  return {
    id: crypto.randomUUID(),
    name: "New Calculator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schemaVersion: 3,
    assumptions: { roles: [roleA, roleB], hoursPerWeek: 40, loadedMultiplier: 1.3, annualToolCost: 50000, currency: "USD" },
    stages: [],
    wizardState: { currentStep: 1, isComplete: false },
  };
}
