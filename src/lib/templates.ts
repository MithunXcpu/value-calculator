import { Assumptions, Calculator, Role, Stage, SoftBenefit } from "./types";

function makeRole(label: string, rate: number): Role {
  return { id: crypto.randomUUID(), label, hourlyRate: rate };
}

function makeSoftBenefit(
  type: SoftBenefit["type"],
  label: string,
  description: string,
  impactPct: number,
  rationale: string
): SoftBenefit {
  return { id: crypto.randomUUID(), type, label, description, impactPct, rationale };
}

function makeStage(
  name: string,
  roleIds: string[],
  allocations: { baseline: number; gain: number }[],
  assumptions: string,
  rationale: string,
  people: number,
  workflow = "",
  softBenefits: SoftBenefit[] = []
): Stage {
  return {
    id: crypto.randomUUID(),
    name,
    roleAllocations: allocations.map((a, i) => ({ roleId: roleIds[i], baseline: a.baseline, gain: a.gain })),
    assumptions,
    rationale,
    peopleAffected: people,
    workflow,
    softBenefits,
  };
}

interface TemplateStageData {
  name: string;
  allocs: { baseline: number; gain: number }[];
  assumptions: string;
  rationale: string;
  people: number;
  workflow?: string;
  softBenefits?: SoftBenefit[];
}

function buildTemplate(
  name: string,
  description: string,
  category: string,
  roles: Role[],
  stageData: TemplateStageData[],
  overrides: Partial<Assumptions> = {}
) {
  const roleIds = roles.map((r) => r.id);
  const assumptions: Assumptions = { roles, hoursPerWeek: 40, loadedMultiplier: 1.3, annualToolCost: 50000, currency: "USD", ...overrides };
  const stages = stageData.map((s) => makeStage(s.name, roleIds, s.allocs, s.assumptions, s.rationale, s.people, s.workflow, s.softBenefits));
  return { name, description, category, stages, assumptions };
}

// =============================================================================
// EXISTING TEMPLATES (3)
// =============================================================================

const gcRole = makeRole("General Counsel", 200);
const raRole = makeRole("Risk Analyst", 100);

const riskManagement = buildTemplate("Risk Management", "Model ROI for risk management software based on GRC workflow stages.", "GRC", [gcRole, raRole], [
  { name: "Identify Existing Risks", allocs: [{ baseline: 15, gain: 60 }, { baseline: 20, gain: 50 }], assumptions: "Current process involves manual spreadsheet reviews", rationale: "AI-powered risk scanning reduces manual identification time", people: 5, workflow: "Manual review of risk registers and documentation", softBenefits: [makeSoftBenefit("risk_exposure", "Risk Visibility", "Comprehensive risk identification reduces blind spots", 35, "Organizations using automated risk scanning identify 35% more risks (PwC Global Risk Survey, 2023)"), makeSoftBenefit("compliance", "Regulatory Readiness", "Continuous risk monitoring improves audit readiness", 25, "Automated GRC platforms reduce audit preparation time by 25% (Deloitte, 2024)")] },
  { name: "Workshops to Identify New Risks", allocs: [{ baseline: 10, gain: 40 }, { baseline: 15, gain: 30 }], assumptions: "Quarterly workshops with 8-10 stakeholders", rationale: "Pre-populated risk libraries accelerate workshop prep", people: 10, workflow: "Schedule, prepare, facilitate, and document workshops" },
  { name: "Create/Maintain Risk Register", allocs: [{ baseline: 20, gain: 70 }, { baseline: 25, gain: 60 }], assumptions: "Register maintained in Excel with manual updates", rationale: "Centralized platform with automated workflows", people: 3, workflow: "Manual data entry and cross-referencing", softBenefits: [makeSoftBenefit("tech_debt", "Data Integrity", "Single source of truth eliminates version conflicts", 40, "Centralized risk registers reduce data inconsistencies by 40% (McKinsey, 2023)")] },
  { name: "Educate Risk Owners", allocs: [{ baseline: 8, gain: 50 }, { baseline: 12, gain: 40 }], assumptions: "Training sessions scheduled ad hoc", rationale: "Self-service training modules and automated reminders", people: 15, workflow: "Create training materials and schedule sessions" },
  { name: "Risk Assessment & Review", allocs: [{ baseline: 15, gain: 65 }, { baseline: 20, gain: 55 }], assumptions: "Annual assessment cycle with manual scoring", rationale: "Continuous monitoring with real-time dashboards", people: 8, workflow: "Collect data, score risks, compile reports" },
  { name: "Verify Risks (Monitor)", allocs: [{ baseline: 12, gain: 70 }, { baseline: 18, gain: 65 }], assumptions: "Monthly manual verification checks", rationale: "Automated monitoring with exception-based alerts", people: 4, workflow: "Manual checks against risk indicators" },
  { name: "Reporting", allocs: [{ baseline: 12, gain: 80 }, { baseline: 15, gain: 70 }], assumptions: "Manual Excel report creation for board presentations", rationale: "One-click automated report generation", people: 6, workflow: "Gather data, create charts, format reports" },
  { name: "Ad Hoc Requests", allocs: [{ baseline: 8, gain: 50 }, { baseline: 6, gain: 40 }], assumptions: "Unplanned requests disrupt regular workflow", rationale: "Self-service access reduces ad hoc burden", people: 5, workflow: "Respond to urgent requests from leadership" },
]);

const plRole = makeRole("Project Lead", 150);
const tmRole = makeRole("Team Member", 85);

const softwareROI = buildTemplate("Software ROI", "Justify a software purchase by modeling efficiency gains across evaluation, implementation, training, support, and optimization.", "General", [plRole, tmRole], [
  { name: "Software Evaluation", allocs: [{ baseline: 10, gain: 50 }, { baseline: 15, gain: 40 }], assumptions: "Manual vendor comparison across multiple criteria", rationale: "Structured evaluation framework with scoring templates", people: 4, workflow: "Research vendors, schedule demos, compare features" },
  { name: "Implementation & Setup", allocs: [{ baseline: 20, gain: 60 }, { baseline: 30, gain: 55 }], assumptions: "Custom configuration and data migration required", rationale: "Pre-built templates and automated migration tools", people: 6, workflow: "Configure system, migrate data, set up integrations", softBenefits: [makeSoftBenefit("tech_debt", "Reduced Technical Debt", "Modern platform eliminates legacy system maintenance", 30, "Cloud migration reduces infrastructure maintenance burden by 30% (Gartner, 2024)")] },
  { name: "User Training", allocs: [{ baseline: 8, gain: 45 }, { baseline: 20, gain: 50 }], assumptions: "In-person training sessions with manual materials", rationale: "Interactive self-paced learning modules", people: 20, workflow: "Create training content, schedule sessions, track completion" },
  { name: "Ongoing Support", allocs: [{ baseline: 5, gain: 55 }, { baseline: 15, gain: 60 }], assumptions: "Manual ticket handling and troubleshooting", rationale: "AI-assisted support with knowledge base", people: 3, workflow: "Handle support tickets and escalations" },
  { name: "Optimization & Reporting", allocs: [{ baseline: 10, gain: 65 }, { baseline: 12, gain: 50 }], assumptions: "Manual data collection for usage reports", rationale: "Automated analytics dashboards", people: 4, workflow: "Collect metrics, analyze adoption, recommend improvements" },
]);

const peRole = makeRole("Process Engineer", 130);
const osRole = makeRole("Operations Staff", 75);

const processAutomation = buildTemplate("Process Automation", "Calculate savings from automating manual workflows. Covers process mapping through continuous improvement.", "Operations", [peRole, osRole], [
  { name: "Process Mapping", allocs: [{ baseline: 12, gain: 45 }, { baseline: 18, gain: 40 }], assumptions: "Manual documentation of current workflows", rationale: "Digital process mining and automated mapping", people: 5, workflow: "Interview stakeholders, document steps, identify bottlenecks" },
  { name: "Automation Development", allocs: [{ baseline: 15, gain: 55 }, { baseline: 25, gain: 50 }], assumptions: "Custom scripting and manual integration work", rationale: "Low-code automation builders with pre-built connectors", people: 4, workflow: "Design automation rules, build workflows, configure triggers", softBenefits: [makeSoftBenefit("tech_debt", "Code Elimination", "Low-code replaces fragile custom scripts", 45, "Low-code platforms reduce custom code maintenance by 45% (Forrester, 2024)"), makeSoftBenefit("employee_satisfaction", "Developer Experience", "Engineers focus on high-value work instead of maintenance", 20, "Automation of repetitive tasks increases developer satisfaction scores by 20% (Stack Overflow Survey, 2024)")] },
  { name: "Testing & Validation", allocs: [{ baseline: 8, gain: 50 }, { baseline: 15, gain: 45 }], assumptions: "Manual test cases and validation checks", rationale: "Automated testing frameworks with regression suites", people: 6, workflow: "Create test scenarios, execute tests, validate outputs" },
  { name: "Deployment & Rollout", allocs: [{ baseline: 5, gain: 40 }, { baseline: 12, gain: 35 }], assumptions: "Manual deployment with change management", rationale: "Automated deployment pipelines with rollback capability", people: 10, workflow: "Deploy changes, communicate updates, monitor adoption" },
  { name: "Monitoring & Maintenance", allocs: [{ baseline: 10, gain: 65 }, { baseline: 15, gain: 60 }], assumptions: "Manual monitoring and periodic reviews", rationale: "Real-time monitoring dashboards with automated alerts", people: 3, workflow: "Track performance, identify issues, apply fixes" },
  { name: "Continuous Improvement", allocs: [{ baseline: 8, gain: 50 }, { baseline: 10, gain: 45 }], assumptions: "Ad hoc improvement suggestions", rationale: "Data-driven optimization recommendations", people: 5, workflow: "Analyze metrics, propose improvements, implement changes" },
]);

// =============================================================================
// AI TEMPLATES (4)
// =============================================================================

const aiDocumentProcessing = buildTemplate(
  "AI Document Processing", "ROI for AI-powered document extraction, classification, and processing replacing manual data entry.", "AI",
  [makeRole("AI/ML Engineer", 180), makeRole("Data Entry Staff", 55)],
  [
    { name: "Document Ingestion & Classification", allocs: [{ baseline: 6, gain: 80 }, { baseline: 15, gain: 75 }], assumptions: "Staff manually sorts and routes 500+ documents/week", rationale: "AI classification achieves 95%+ accuracy on document routing (McKinsey, 2024)", people: 8, workflow: "Receive documents, read content, classify type, route to team", softBenefits: [makeSoftBenefit("risk_exposure", "Error Reduction", "AI classification eliminates human misfiling errors", 60, "AI document classification reduces misfiling rates by 60% (Gartner, 2024)"), makeSoftBenefit("compliance", "Audit Trail", "Every document gets automatic metadata tagging and tracking", 30, "Automated document tracking improves audit compliance by 30% (Deloitte, 2024)")] },
    { name: "Data Extraction & Validation", allocs: [{ baseline: 10, gain: 70 }, { baseline: 20, gain: 65 }], assumptions: "Manual key-in of invoice fields, contract terms, and form data", rationale: "OCR + NLP extracts structured data with 92-98% accuracy (Forrester, 2024)", people: 12, workflow: "Open document, identify fields, type into system, cross-check", softBenefits: [makeSoftBenefit("tech_debt", "System Modernization", "Replaces legacy data entry scripts and macros", 35, "AI extraction eliminates 35% of legacy data processing scripts (Accenture, 2024)")] },
    { name: "Exception Handling & QA", allocs: [{ baseline: 8, gain: 50 }, { baseline: 10, gain: 45 }], assumptions: "Staff reviews flagged documents and corrects extraction errors", rationale: "Confidence scoring surfaces only true exceptions for human review", people: 5, workflow: "Review AI-flagged items, correct errors, update training data" },
    { name: "Reporting & Analytics", allocs: [{ baseline: 5, gain: 60 }, { baseline: 8, gain: 55 }], assumptions: "Weekly manual compilation of processing metrics", rationale: "Real-time dashboards with processing volume and accuracy metrics", people: 3, workflow: "Gather stats, build charts, email report to leadership" },
  ],
  { annualToolCost: 75000 }
);

const aiCustomerService = buildTemplate(
  "AI Customer Service", "Model ROI for AI chatbots, agent assist, and automated ticket routing in support operations.", "AI",
  [makeRole("Support Manager", 130), makeRole("Support Agent", 65)],
  [
    { name: "Ticket Triage & Routing", allocs: [{ baseline: 5, gain: 70 }, { baseline: 12, gain: 75 }], assumptions: "Agents manually read, categorize, and assign incoming tickets", rationale: "AI auto-classification routes 75% of tickets instantly (Zendesk, 2024)", people: 15, workflow: "Read ticket, determine category, assign to specialist queue", softBenefits: [makeSoftBenefit("employee_satisfaction", "Agent Morale", "Agents handle meaningful issues instead of repetitive triage", 25, "AI ticket routing improves agent satisfaction by 25% (Zendesk, 2024)"), makeSoftBenefit("brand_reputation", "Response Time SLA", "Faster first-response times improve customer perception", 30, "Sub-5-minute first response increases CSAT by 30% (Salesforce, 2024)")] },
    { name: "AI Chatbot Deflection", allocs: [{ baseline: 3, gain: 40 }, { baseline: 20, gain: 60 }], assumptions: "All inquiries currently handled by human agents", rationale: "AI chatbots resolve 40-60% of L1 queries without human intervention (Gartner, 2024)", people: 20, workflow: "Customer submits query, agent reads, researches, responds", softBenefits: [makeSoftBenefit("risk_exposure", "24/7 Coverage", "AI provides always-on support reducing after-hours risk", 40, "24/7 AI coverage reduces missed critical requests by 40% (Forrester, 2024)")] },
    { name: "Agent Assist & Knowledge", allocs: [{ baseline: 8, gain: 45 }, { baseline: 15, gain: 50 }], assumptions: "Agents manually search knowledge base and past tickets", rationale: "AI surfaces relevant articles and suggested responses in real-time", people: 15, workflow: "Search KB, read articles, draft response, customize" },
    { name: "Quality Assurance & CSAT", allocs: [{ baseline: 10, gain: 55 }, { baseline: 8, gain: 40 }], assumptions: "Manual review of random ticket samples for quality scoring", rationale: "AI analyzes 100% of conversations for sentiment and compliance", people: 4, workflow: "Select sample tickets, score against rubric, compile QA report", softBenefits: [makeSoftBenefit("compliance", "Conversation Compliance", "AI flags non-compliant conversations automatically", 50, "AI QA catches 50% more compliance issues than manual sampling (PwC, 2024)")] },
    { name: "Reporting & Insights", allocs: [{ baseline: 6, gain: 65 }, { baseline: 5, gain: 50 }], assumptions: "Manual data pulls and spreadsheet analysis for support metrics", rationale: "Real-time AI-powered dashboards with trend detection and forecasting", people: 3, workflow: "Pull data, create pivot tables, write insights" },
  ],
  { annualToolCost: 60000 }
);

const aiCodeAssistant = buildTemplate(
  "AI Code Assistant", "Developer productivity gains from AI pair programming, code review automation, and test generation.", "AI",
  [makeRole("Senior Developer", 175), makeRole("Junior Developer", 95)],
  [
    { name: "Code Writing & Completion", allocs: [{ baseline: 18, gain: 40 }, { baseline: 22, gain: 55 }], assumptions: "Developers write all code manually with IDE autocomplete only", rationale: "AI pair programming increases code output by 40-55% for routine tasks (GitHub, 2024)", people: 25, workflow: "Read requirements, design solution, write code, compile, debug", softBenefits: [makeSoftBenefit("employee_satisfaction", "Developer Flow", "Less boilerplate writing improves deep work time", 30, "Developers using AI assistants report 30% more time in flow state (GitHub, 2024)"), makeSoftBenefit("tech_debt", "Code Consistency", "AI enforces patterns and reduces style drift", 25, "AI-assisted code shows 25% fewer style violations (Sonar, 2024)")] },
    { name: "Code Review", allocs: [{ baseline: 8, gain: 35 }, { baseline: 5, gain: 30 }], assumptions: "Senior devs spend ~8 hrs/wk reviewing pull requests", rationale: "AI pre-reviews flag issues before human review, reducing cycles by 35%", people: 15, workflow: "Open PR, read diff, leave comments, request changes, approve", softBenefits: [makeSoftBenefit("risk_exposure", "Security Scanning", "AI catches security vulnerabilities during review", 40, "AI code review detects 40% more security issues (Snyk, 2024)")] },
    { name: "Test Generation", allocs: [{ baseline: 6, gain: 50 }, { baseline: 10, gain: 60 }], assumptions: "Manual test writing with low coverage targets", rationale: "AI generates unit and integration tests, boosting coverage 50-60%", people: 20, workflow: "Identify scenarios, write test code, run suite, fix failures" },
    { name: "Documentation", allocs: [{ baseline: 4, gain: 60 }, { baseline: 6, gain: 55 }], assumptions: "Documentation often skipped or outdated due to time pressure", rationale: "AI auto-generates docs from code changes and keeps them synced", people: 20, workflow: "Write README, update API docs, create diagrams" },
    { name: "Bug Investigation", allocs: [{ baseline: 6, gain: 30 }, { baseline: 8, gain: 35 }], assumptions: "Manual log analysis and stack trace investigation", rationale: "AI analyzes error patterns and suggests root causes", people: 20, workflow: "Read logs, reproduce bug, trace through code, identify cause" },
  ],
  { annualToolCost: 45000 }
);

const aiSalesIntelligence = buildTemplate(
  "AI Sales Intelligence", "ROI for AI-powered lead scoring, conversation intelligence, and pipeline forecasting.", "AI",
  [makeRole("Sales Manager", 160), makeRole("Account Executive", 110)],
  [
    { name: "Lead Scoring & Prioritization", allocs: [{ baseline: 5, gain: 55 }, { baseline: 10, gain: 60 }], assumptions: "Reps manually qualify leads based on firmographic data and gut feel", rationale: "AI lead scoring improves win rates by 55-60% (Gartner Sales, 2024)", people: 12, workflow: "Review leads, research company, score, assign priority", softBenefits: [makeSoftBenefit("risk_exposure", "Pipeline Quality", "AI reduces time wasted on unqualified leads", 45, "AI scoring reduces time on unqualified leads by 45% (Salesforce, 2024)"), makeSoftBenefit("brand_reputation", "Faster Response", "Hot leads get immediate attention improving win rates", 20, "Sub-1-hour response increases conversion 7x (Harvard Business Review)")] },
    { name: "Conversation Intelligence", allocs: [{ baseline: 8, gain: 50 }, { baseline: 12, gain: 45 }], assumptions: "Managers manually listen to recorded calls for coaching", rationale: "AI transcribes, scores, and surfaces coaching moments automatically", people: 15, workflow: "Record call, listen replay, take notes, schedule coaching" },
    { name: "Pipeline Forecasting", allocs: [{ baseline: 10, gain: 65 }, { baseline: 8, gain: 50 }], assumptions: "Weekly manual pipeline review using spreadsheets and CRM data", rationale: "AI predicts close probability with 80%+ accuracy (Forrester, 2024)", people: 8, workflow: "Pull CRM data, update stages, calculate weighted pipeline", softBenefits: [makeSoftBenefit("risk_exposure", "Forecast Accuracy", "Better forecasts reduce revenue surprises", 35, "AI forecasting improves accuracy by 35% (McKinsey, 2024)")] },
    { name: "Proposal & Content Generation", allocs: [{ baseline: 4, gain: 55 }, { baseline: 10, gain: 60 }], assumptions: "Reps manually customize proposals and email sequences", rationale: "AI generates personalized proposals from templates", people: 12, workflow: "Copy template, customize, research prospect, personalize" },
    { name: "CRM Data Hygiene", allocs: [{ baseline: 3, gain: 70 }, { baseline: 6, gain: 65 }], assumptions: "Manual data entry and periodic cleanup of CRM records", rationale: "AI auto-logs activities and enriches contact records", people: 12, workflow: "Log calls, update stages, enter notes, deduplicate", softBenefits: [makeSoftBenefit("tech_debt", "Data Quality", "Automated CRM hygiene eliminates cleanup backlogs", 50, "AI CRM enrichment reduces data decay by 50% (ZoomInfo, 2024)")] },
  ],
  { annualToolCost: 55000 }
);

// =============================================================================
// INDUSTRY TEMPLATES (6)
// =============================================================================

const hrPeopleOps = buildTemplate(
  "HR & People Operations", "Efficiency gains across recruiting, onboarding, performance management, and HR compliance.", "HR",
  [makeRole("HR Manager", 120), makeRole("Recruiter", 85)],
  [
    { name: "Recruitment & Screening", allocs: [{ baseline: 8, gain: 50 }, { baseline: 20, gain: 55 }], assumptions: "Manual resume screening of 200+ applicants per role", rationale: "AI resume screening reduces time-to-shortlist by 50-55% (LinkedIn, 2024)", people: 6, workflow: "Post job, collect apps, screen resumes, schedule interviews", softBenefits: [makeSoftBenefit("risk_exposure", "Bias Reduction", "Structured AI screening reduces unconscious bias", 30, "Structured screening reduces adverse impact by 30% (SHRM, 2024)"), makeSoftBenefit("brand_reputation", "Candidate Experience", "Faster responses improve employer brand", 25, "Fast responses make candidates 25% more likely to accept (Glassdoor, 2024)")] },
    { name: "Onboarding", allocs: [{ baseline: 10, gain: 45 }, { baseline: 12, gain: 40 }], assumptions: "Manual onboarding checklists and in-person orientations", rationale: "Automated workflows with self-service portals", people: 15, workflow: "Create accounts, assign training, schedule orientation" },
    { name: "Performance Reviews", allocs: [{ baseline: 12, gain: 55 }, { baseline: 8, gain: 40 }], assumptions: "Annual review cycle with manual form collection", rationale: "Continuous feedback platforms with automated review cycles", people: 50, workflow: "Distribute forms, collect feedback, compile ratings", softBenefits: [makeSoftBenefit("employee_satisfaction", "Continuous Feedback", "Regular feedback loops improve engagement", 35, "Continuous feedback increases engagement by 35% (Gallup, 2024)")] },
    { name: "Compliance & Reporting", allocs: [{ baseline: 8, gain: 60 }, { baseline: 6, gain: 50 }], assumptions: "Manual tracking of certifications and labor law compliance", rationale: "Automated compliance tracking with alert notifications", people: 4, workflow: "Track deadlines, pull reports, verify compliance", softBenefits: [makeSoftBenefit("compliance", "Labor Law Compliance", "Automated tracking prevents violations", 40, "Automated compliance tracking reduces violations by 40% (Deloitte HR, 2024)")] },
    { name: "Employee Self-Service", allocs: [{ baseline: 6, gain: 65 }, { baseline: 10, gain: 60 }], assumptions: "HR handles PTO requests, benefits questions manually", rationale: "Self-service portal with AI chatbot handles routine queries", people: 100, workflow: "Receive request, look up policy, respond via email" },
  ],
  { annualToolCost: 40000 }
);

const marketingOps = buildTemplate(
  "Marketing Operations", "ROI for marketing automation, content creation, campaign management, and analytics.", "Marketing",
  [makeRole("Marketing Director", 160), makeRole("Content Manager", 90)],
  [
    { name: "Campaign Planning & Execution", allocs: [{ baseline: 10, gain: 45 }, { baseline: 15, gain: 50 }], assumptions: "Manual campaign setup across channels with spreadsheet tracking", rationale: "Marketing automation reduces launch time by 45-50% (HubSpot, 2024)", people: 6, workflow: "Plan campaign, create assets, configure channels, launch" },
    { name: "Content Creation", allocs: [{ baseline: 5, gain: 35 }, { baseline: 18, gain: 50 }], assumptions: "Manual writing, editing, and design for all channels", rationale: "AI content tools accelerate draft creation by 50%", people: 4, workflow: "Research topic, write draft, edit, design, publish", softBenefits: [makeSoftBenefit("brand_reputation", "Content Consistency", "AI maintains consistent brand voice across channels", 30, "Brand consistency increases revenue by 30% (Lucidpress, 2024)")] },
    { name: "Lead Nurturing", allocs: [{ baseline: 8, gain: 55 }, { baseline: 10, gain: 50 }], assumptions: "Manual email sequences and follow-up tracking", rationale: "Automated drip campaigns with behavioral triggers", people: 5, workflow: "Segment audience, write emails, schedule, track" },
    { name: "Analytics & Attribution", allocs: [{ baseline: 12, gain: 60 }, { baseline: 8, gain: 45 }], assumptions: "Manual data from 5+ platforms for dashboards", rationale: "Unified analytics with multi-touch attribution modeling", people: 3, workflow: "Pull data, normalize, build reports, present", softBenefits: [makeSoftBenefit("risk_exposure", "Budget Optimization", "Better attribution prevents wasted ad spend", 25, "Multi-touch attribution reduces wasted spend by 25% (Gartner, 2024)")] },
    { name: "Social Media Management", allocs: [{ baseline: 3, gain: 40 }, { baseline: 12, gain: 55 }], assumptions: "Manual posting and community management across platforms", rationale: "Scheduling tools with AI-powered optimal timing", people: 3, workflow: "Create posts, schedule, monitor, respond" },
  ],
  { annualToolCost: 35000 }
);

const financeAccounting = buildTemplate(
  "Finance & Accounting", "Automate accounts payable, reconciliation, close processes, and financial reporting.", "Finance",
  [makeRole("Finance Director", 190), makeRole("Accountant", 95)],
  [
    { name: "Accounts Payable", allocs: [{ baseline: 5, gain: 55 }, { baseline: 18, gain: 70 }], assumptions: "Manual invoice receipt, matching, and payment processing", rationale: "AI invoice matching automates 70% of AP workflow (Deloitte, 2024)", people: 6, workflow: "Receive invoice, match to PO, verify, code GL, approve, pay", softBenefits: [makeSoftBenefit("risk_exposure", "Fraud Prevention", "AI detects duplicate invoices and anomalous payments", 45, "AI fraud detection catches 45% more anomalies (ACFE, 2024)"), makeSoftBenefit("compliance", "Audit Readiness", "Automated AP creates complete audit trail", 35, "Automated AP reduces audit findings by 35% (PwC, 2024)")] },
    { name: "Month-End Close", allocs: [{ baseline: 15, gain: 50 }, { baseline: 20, gain: 55 }], assumptions: "10-15 day close with manual reconciliation", rationale: "Close automation reduces cycle time by 50-55% (BlackLine, 2024)", people: 8, workflow: "Reconcile accounts, post entries, review variances" },
    { name: "Expense Management", allocs: [{ baseline: 4, gain: 60 }, { baseline: 10, gain: 65 }], assumptions: "Manual expense report submission and approval", rationale: "Mobile capture with AI receipt scanning and auto-enforcement", people: 50, workflow: "Collect receipts, fill form, submit, reimburse" },
    { name: "Financial Reporting", allocs: [{ baseline: 12, gain: 55 }, { baseline: 10, gain: 45 }], assumptions: "Manual compilation from multiple systems into Excel", rationale: "Automated consolidation with real-time dashboards", people: 5, workflow: "Pull data, consolidate, adjust, create charts" },
    { name: "Budget & Forecasting", allocs: [{ baseline: 10, gain: 40 }, { baseline: 8, gain: 35 }], assumptions: "Annual budget cycle with manual reconciliation", rationale: "Connected planning with scenario modeling and rolling forecasts", people: 10, workflow: "Collect inputs, reconcile, model scenarios, present", softBenefits: [makeSoftBenefit("risk_exposure", "Forecast Accuracy", "AI forecasting reduces budget variance", 30, "AI reduces budget variance by 30% (FP&A Trends, 2024)")] },
  ],
  { annualToolCost: 65000 }
);

const cybersecurity = buildTemplate(
  "Cybersecurity Operations", "Savings from SIEM automation, threat detection, incident response, and vulnerability management.", "Security",
  [makeRole("Security Lead", 170), makeRole("Security Analyst", 110)],
  [
    { name: "Threat Detection & Triage", allocs: [{ baseline: 8, gain: 60 }, { baseline: 20, gain: 65 }], assumptions: "Analysts manually review 1000+ alerts/day with high false positives", rationale: "AI SOAR reduces alert fatigue by correlating threats (Gartner Security, 2024)", people: 8, workflow: "Monitor SIEM, investigate alerts, correlate, escalate", softBenefits: [makeSoftBenefit("risk_exposure", "Threat Response Time", "AI reduces MTTD from hours to minutes", 55, "SOAR platforms reduce MTTD by 55% (Ponemon Institute, 2024)"), makeSoftBenefit("compliance", "Security Compliance", "Automated logging meets SOC 2, ISO 27001, NIST", 40, "Automated logging reduces compliance gaps by 40% (ISACA, 2024)")] },
    { name: "Incident Response", allocs: [{ baseline: 10, gain: 45 }, { baseline: 15, gain: 50 }], assumptions: "Manual playbook execution with email coordination", rationale: "Automated playbooks with orchestrated response actions", people: 6, workflow: "Classify, execute playbook, coordinate, remediate, document" },
    { name: "Vulnerability Management", allocs: [{ baseline: 6, gain: 50 }, { baseline: 12, gain: 55 }], assumptions: "Monthly manual scans with spreadsheet tracking", rationale: "Continuous scanning with risk-based prioritization", people: 5, workflow: "Run scans, analyze, prioritize, assign, verify", softBenefits: [makeSoftBenefit("tech_debt", "Patch Currency", "Automated patching reduces unpatched system backlog", 40, "Automated vulnerability mgmt reduces patch backlog by 40% (Qualys, 2024)")] },
    { name: "Compliance & Audit", allocs: [{ baseline: 8, gain: 55 }, { baseline: 10, gain: 50 }], assumptions: "Manual evidence collection for quarterly audits", rationale: "Automated evidence collection and continuous monitoring", people: 4, workflow: "Identify controls, collect evidence, document, prepare" },
    { name: "Security Awareness Training", allocs: [{ baseline: 5, gain: 40 }, { baseline: 8, gain: 35 }], assumptions: "Annual training with manual phishing simulations", rationale: "Continuous micro-learning with adaptive phishing campaigns", people: 100, workflow: "Create content, schedule, track completion, report" },
  ],
  { annualToolCost: 80000 }
);

const supplyChain = buildTemplate(
  "Supply Chain & Logistics", "Demand forecasting, inventory optimization, warehouse automation, and shipment tracking.", "Operations",
  [makeRole("Supply Chain Manager", 145), makeRole("Logistics Coordinator", 80)],
  [
    { name: "Demand Forecasting", allocs: [{ baseline: 10, gain: 50 }, { baseline: 8, gain: 40 }], assumptions: "Manual forecasting from historical sales and spreadsheets", rationale: "ML demand sensing improves accuracy by 40-50% (Gartner, 2024)", people: 5, workflow: "Collect data, apply adjustments, review with sales", softBenefits: [makeSoftBenefit("risk_exposure", "Stockout Prevention", "Better forecasts reduce lost sales from stockouts", 35, "AI forecasting reduces stockouts by 35% (McKinsey, 2024)"), makeSoftBenefit("risk_exposure", "Overstock Reduction", "Accurate signals prevent excess inventory write-offs", 30, "Demand sensing reduces excess inventory by 30% (BCG, 2024)")] },
    { name: "Inventory Optimization", allocs: [{ baseline: 8, gain: 45 }, { baseline: 12, gain: 50 }], assumptions: "Fixed reorder points with manual safety stock calculations", rationale: "Dynamic optimization adjusts levels based on demand signals", people: 6, workflow: "Review stock, calculate reorder points, place POs" },
    { name: "Order Management", allocs: [{ baseline: 5, gain: 55 }, { baseline: 15, gain: 60 }], assumptions: "Manual order processing with email/phone coordination", rationale: "Automated order orchestration with real-time tracking", people: 10, workflow: "Receive order, check inventory, allocate, ship, confirm" },
    { name: "Shipment Tracking", allocs: [{ baseline: 4, gain: 60 }, { baseline: 10, gain: 65 }], assumptions: "Manual tracking via carrier websites and phone calls", rationale: "Control tower visibility with predictive ETA", people: 8, workflow: "Check portals, update customer, manage exceptions" },
    { name: "Supplier Management", allocs: [{ baseline: 8, gain: 35 }, { baseline: 6, gain: 30 }], assumptions: "Manual performance tracking and contract management", rationale: "Supplier portal with automated scorecards", people: 4, workflow: "Track deliveries, score, manage contracts, review", softBenefits: [makeSoftBenefit("compliance", "Supplier Compliance", "Automated monitoring ensures ESG and quality standards", 30, "Automated monitoring improves compliance by 30% (Deloitte, 2024)")] },
  ],
  { annualToolCost: 55000 }
);

const legalOps = buildTemplate(
  "Legal Operations", "Contract lifecycle management, legal research AI, e-discovery, and matter management.", "Legal",
  [makeRole("Legal Counsel", 220), makeRole("Paralegal", 85)],
  [
    { name: "Contract Review & Redlining", allocs: [{ baseline: 15, gain: 60 }, { baseline: 12, gain: 55 }], assumptions: "Attorneys manually read and redline every clause", rationale: "AI contract review reduces review time by 60% (Thomson Reuters, 2024)", people: 8, workflow: "Read contract, identify risks, compare to playbook, draft redlines", softBenefits: [makeSoftBenefit("risk_exposure", "Contract Risk", "AI catches unfavorable terms manual review might miss", 40, "AI review identifies 40% more risk clauses (Deloitte Legal, 2024)"), makeSoftBenefit("compliance", "Regulatory Clauses", "Ensures required regulatory language in all contracts", 35, "Automated clause checking improves compliance by 35% (Thomson Reuters, 2024)")] },
    { name: "Legal Research", allocs: [{ baseline: 12, gain: 50 }, { baseline: 15, gain: 55 }], assumptions: "Manual case law research using traditional databases", rationale: "AI research surfaces relevant precedents 50% faster (LexisNexis, 2024)", people: 6, workflow: "Define question, search databases, read cases, synthesize" },
    { name: "E-Discovery", allocs: [{ baseline: 8, gain: 70 }, { baseline: 20, gain: 75 }], assumptions: "Manual document review for litigation", rationale: "TAR reduces review volumes by 70-75% (RAND Corporation)", people: 10, workflow: "Collect ESI, process, train model, review flagged docs" },
    { name: "Matter Management", allocs: [{ baseline: 6, gain: 45 }, { baseline: 8, gain: 40 }], assumptions: "Matter tracking via email and spreadsheets", rationale: "Centralized management with automated workflow and deadlines", people: 8, workflow: "Create matter, assign team, track deadlines, manage budget" },
    { name: "Legal Billing & Spend", allocs: [{ baseline: 5, gain: 55 }, { baseline: 10, gain: 60 }], assumptions: "Manual invoice review and outside counsel guideline enforcement", rationale: "AI bill review auto-flags guideline violations and rate anomalies", people: 4, workflow: "Receive invoices, check rates, verify, flag, approve", softBenefits: [makeSoftBenefit("tech_debt", "Vendor Consolidation", "Centralized platform replaces fragmented tools", 25, "Legal spend platforms reduce outside counsel spend by 25% (ACC, 2024)")] },
  ],
  { annualToolCost: 70000 }
);

// =============================================================================
// EXPORT
// =============================================================================

export const templates = [
  aiDocumentProcessing,
  aiCustomerService,
  aiCodeAssistant,
  aiSalesIntelligence,
  hrPeopleOps,
  marketingOps,
  financeAccounting,
  cybersecurity,
  supplyChain,
  legalOps,
  riskManagement,
  softwareROI,
  processAutomation,
];

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
      softBenefits: s.softBenefits?.map((sb) => ({ ...sb, id: crypto.randomUUID() })),
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
