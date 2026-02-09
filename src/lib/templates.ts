import { Assumptions, Calculator, Stage } from "./types";

const defaultAssumptions: Assumptions = {
  roleALabel: "General Counsel",
  roleBLabel: "FTE",
  rateA: 200,
  rateB: 100,
  hoursPerWeek: 40,
  loadedMultiplier: 1.3,
  annualToolCost: 50000,
  currency: "USD",
};

function makeStage(name: string, bA: number, bB: number, gA: number, gB: number, assumptions: string, rationale: string, people: number, workflow = ""): Stage {
  return { id: crypto.randomUUID(), name, baselineA: bA, baselineB: bB, gainA: gA, gainB: gB, assumptions, rationale, peopleAffected: people, workflow };
}

const riskManagementStages: Stage[] = [
  makeStage("Identify Existing Risks", 15, 20, 60, 50, "Current process involves manual spreadsheet reviews", "AI-powered risk scanning reduces manual identification time", 5, "Manual review of risk registers and documentation"),
  makeStage("Workshops to Identify New Risks", 10, 15, 40, 30, "Quarterly workshops with 8-10 stakeholders", "Pre-populated risk libraries accelerate workshop prep", 10, "Schedule, prepare, facilitate, and document workshops"),
  makeStage("Create/Maintain Risk Register", 20, 25, 70, 60, "Register maintained in Excel with manual updates", "Centralized platform with automated workflows", 3, "Manual data entry and cross-referencing across spreadsheets"),
  makeStage("Educate Risk Owners", 8, 12, 50, 40, "Training sessions scheduled ad hoc", "Self-service training modules and automated reminders", 15, "Create training materials and schedule sessions"),
  makeStage("Risk Assessment & Review", 15, 20, 65, 55, "Annual assessment cycle with manual scoring", "Continuous monitoring with real-time dashboards", 8, "Collect data, score risks, compile reports"),
  makeStage("Verify Risks (Monitor)", 12, 18, 70, 65, "Monthly manual verification checks", "Automated monitoring with exception-based alerts", 4, "Manual checks against risk indicators"),
  makeStage("Reporting", 12, 15, 80, 70, "Manual Excel report creation for board presentations", "One-click automated report generation with visualizations", 6, "Gather data, create charts, format reports"),
  makeStage("Ad Hoc Requests", 8, 6, 50, 40, "Unplanned requests disrupt regular workflow", "Self-service access reduces ad hoc burden", 5, "Respond to urgent requests from leadership"),
];

const softwareROIStages: Stage[] = [
  makeStage("Software Evaluation", 10, 15, 50, 40, "Manual vendor comparison across multiple criteria", "Structured evaluation framework with scoring templates", 4, "Research vendors, schedule demos, compare features"),
  makeStage("Implementation & Setup", 20, 30, 60, 55, "Custom configuration and data migration required", "Pre-built templates and automated migration tools", 6, "Configure system, migrate data, set up integrations"),
  makeStage("User Training", 8, 20, 45, 50, "In-person training sessions with manual materials", "Interactive self-paced learning modules", 20, "Create training content, schedule sessions, track completion"),
  makeStage("Ongoing Support", 5, 15, 55, 60, "Manual ticket handling and troubleshooting", "AI-assisted support with knowledge base", 3, "Handle support tickets and escalations"),
  makeStage("Optimization & Reporting", 10, 12, 65, 50, "Manual data collection for usage reports", "Automated analytics dashboards", 4, "Collect metrics, analyze adoption, recommend improvements"),
];

const processAutomationStages: Stage[] = [
  makeStage("Process Mapping", 12, 18, 45, 40, "Manual documentation of current workflows", "Digital process mining and automated mapping", 5, "Interview stakeholders, document steps, identify bottlenecks"),
  makeStage("Automation Development", 15, 25, 55, 50, "Custom scripting and manual integration work", "Low-code automation builders with pre-built connectors", 4, "Design automation rules, build workflows, configure triggers"),
  makeStage("Testing & Validation", 8, 15, 50, 45, "Manual test cases and validation checks", "Automated testing frameworks with regression suites", 6, "Create test scenarios, execute tests, validate outputs"),
  makeStage("Deployment & Rollout", 5, 12, 40, 35, "Manual deployment with change management", "Automated deployment pipelines with rollback capability", 10, "Deploy changes, communicate updates, monitor adoption"),
  makeStage("Monitoring & Maintenance", 10, 15, 65, 60, "Manual monitoring and periodic reviews", "Real-time monitoring dashboards with automated alerts", 3, "Track performance, identify issues, apply fixes"),
  makeStage("Continuous Improvement", 8, 10, 50, 45, "Ad hoc improvement suggestions", "Data-driven optimization recommendations", 5, "Analyze metrics, propose improvements, implement changes"),
];

export const templates: { name: string; description: string; stages: Stage[]; assumptions: Assumptions }[] = [
  {
    name: "Risk Management",
    description: "Model ROI for risk management software based on GRC workflow stages. Includes 8 stages from risk identification to ad hoc requests.",
    stages: riskManagementStages,
    assumptions: { ...defaultAssumptions, roleALabel: "General Counsel", roleBLabel: "Risk Analyst" },
  },
  {
    name: "Software ROI",
    description: "Justify a software purchase by modeling efficiency gains across evaluation, implementation, training, support, and optimization.",
    stages: softwareROIStages,
    assumptions: { ...defaultAssumptions, roleALabel: "Project Lead", roleBLabel: "Team Member", rateA: 150, rateB: 85 },
  },
  {
    name: "Process Automation",
    description: "Calculate savings from automating manual workflows. Covers process mapping through continuous improvement.",
    stages: processAutomationStages,
    assumptions: { ...defaultAssumptions, roleALabel: "Process Engineer", roleBLabel: "Operations Staff", rateA: 130, rateB: 75 },
  },
];

export function createCalculatorFromTemplate(templateIdx: number): Calculator {
  const t = templates[templateIdx];
  return {
    id: crypto.randomUUID(),
    name: `${t.name} Calculator`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assumptions: { ...t.assumptions },
    stages: t.stages.map((s) => ({ ...s, id: crypto.randomUUID() })),
  };
}

export function createBlankCalculator(): Calculator {
  return {
    id: crypto.randomUUID(),
    name: "New Calculator",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assumptions: { ...defaultAssumptions },
    stages: [makeStage("Stage 1", 10, 15, 30, 25, "", "", 3)],
  };
}
