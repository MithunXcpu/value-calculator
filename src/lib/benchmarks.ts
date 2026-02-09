/**
 * Curated industry benchmarks for AI/automation ROI estimation.
 * Each benchmark includes a source citation for credibility in generated rationale.
 */

export interface Benchmark {
  category: string;
  metric: string;
  lowPct: number;
  highPct: number;
  source: string;
  year: number;
}

export interface IndustryProfile {
  id: string;
  name: string;
  keywords: string[];
  benchmarks: Benchmark[];
  defaultGainPct: number;
}

export const INDUSTRY_PROFILES: IndustryProfile[] = [
  {
    id: "legal",
    name: "Legal & Compliance",
    keywords: ["legal", "law", "compliance", "contract", "regulatory", "attorney", "paralegal", "litigation", "discovery", "document review"],
    benchmarks: [
      { category: "Document Review", metric: "Time reduction in document review", lowPct: 60, highPct: 75, source: "McKinsey Global Institute, 2023", year: 2023 },
      { category: "Contract Analysis", metric: "Faster contract review cycles", lowPct: 50, highPct: 70, source: "Deloitte Legal Tech Survey, 2023", year: 2023 },
      { category: "Research", metric: "Legal research time savings", lowPct: 30, highPct: 50, source: "Thomson Reuters Institute, 2024", year: 2024 },
      { category: "Compliance", metric: "Regulatory monitoring efficiency", lowPct: 40, highPct: 60, source: "PwC Global Risk Survey, 2023", year: 2023 },
    ],
    defaultGainPct: 55,
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Operations",
    keywords: ["manufacturing", "production", "factory", "supply chain", "logistics", "warehouse", "quality", "assembly", "operations", "industrial"],
    benchmarks: [
      { category: "Labor Productivity", metric: "Labor productivity improvement", lowPct: 7, highPct: 20, source: "Boston Consulting Group, 2024", year: 2024 },
      { category: "Quality Control", metric: "Defect detection improvement", lowPct: 25, highPct: 40, source: "McKinsey Operations Practice, 2023", year: 2023 },
      { category: "Predictive Maintenance", metric: "Downtime reduction", lowPct: 20, highPct: 35, source: "Deloitte AI in Manufacturing, 2023", year: 2023 },
      { category: "Supply Chain", metric: "Supply chain optimization", lowPct: 15, highPct: 30, source: "Gartner Supply Chain Report, 2024", year: 2024 },
    ],
    defaultGainPct: 20,
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    keywords: ["healthcare", "medical", "clinical", "patient", "hospital", "pharma", "biotech", "diagnosis", "treatment", "health"],
    benchmarks: [
      { category: "Clinical Documentation", metric: "Documentation time savings", lowPct: 30, highPct: 50, source: "KLAS Research, 2024", year: 2024 },
      { category: "Diagnosis Support", metric: "Diagnostic accuracy improvement", lowPct: 10, highPct: 25, source: "Nature Medicine, 2023", year: 2023 },
      { category: "Admin Burden", metric: "Administrative task reduction", lowPct: 40, highPct: 60, source: "AMA Physician Practice Report, 2023", year: 2023 },
      { category: "Drug Discovery", metric: "Early-stage screening acceleration", lowPct: 30, highPct: 50, source: "McKinsey Life Sciences, 2024", year: 2024 },
    ],
    defaultGainPct: 35,
  },
  {
    id: "financial",
    name: "Financial Services",
    keywords: ["finance", "banking", "insurance", "fintech", "trading", "investment", "risk", "underwriting", "claims", "audit"],
    benchmarks: [
      { category: "Risk Assessment", metric: "Risk analysis speed improvement", lowPct: 30, highPct: 50, source: "Accenture Banking Report, 2024", year: 2024 },
      { category: "Fraud Detection", metric: "Fraud detection accuracy", lowPct: 20, highPct: 40, source: "McKinsey Financial Services, 2023", year: 2023 },
      { category: "Underwriting", metric: "Underwriting process acceleration", lowPct: 35, highPct: 55, source: "Deloitte Insurance Outlook, 2024", year: 2024 },
      { category: "Reporting", metric: "Regulatory reporting efficiency", lowPct: 40, highPct: 60, source: "PwC Financial Services, 2023", year: 2023 },
    ],
    defaultGainPct: 40,
  },
  {
    id: "saas",
    name: "SaaS & Technology",
    keywords: ["saas", "software", "technology", "platform", "cloud", "api", "devops", "engineering", "developer", "it", "tech"],
    benchmarks: [
      { category: "Code Development", metric: "Developer productivity gain", lowPct: 25, highPct: 55, source: "GitHub Copilot Impact Study, 2024", year: 2024 },
      { category: "Support", metric: "Customer support resolution speed", lowPct: 30, highPct: 50, source: "Zendesk CX Trends, 2024", year: 2024 },
      { category: "QA & Testing", metric: "Testing cycle time reduction", lowPct: 30, highPct: 45, source: "Forrester DevOps Report, 2023", year: 2023 },
      { category: "Sales", metric: "Sales pipeline efficiency", lowPct: 20, highPct: 35, source: "Salesforce State of Sales, 2024", year: 2024 },
    ],
    defaultGainPct: 35,
  },
  {
    id: "professional",
    name: "Professional Services",
    keywords: ["consulting", "advisory", "accounting", "audit", "strategy", "management", "professional", "services", "agency"],
    benchmarks: [
      { category: "Research & Analysis", metric: "Research and analysis time savings", lowPct: 30, highPct: 50, source: "McKinsey Global Institute, 2024", year: 2024 },
      { category: "Report Generation", metric: "Report creation acceleration", lowPct: 40, highPct: 60, source: "Deloitte Tech Trends, 2024", year: 2024 },
      { category: "Client Communication", metric: "Communication drafting speed", lowPct: 25, highPct: 42, source: "Harvard Business Review, 2023", year: 2023 },
      { category: "Project Management", metric: "Project admin overhead reduction", lowPct: 20, highPct: 35, source: "PMI Pulse of Profession, 2024", year: 2024 },
    ],
    defaultGainPct: 38,
  },
  {
    id: "general",
    name: "Cross-Industry / General",
    keywords: ["general", "business", "enterprise", "organization", "company", "automation", "ai", "productivity"],
    benchmarks: [
      { category: "Knowledge Work", metric: "Knowledge worker productivity", lowPct: 25, highPct: 42, source: "McKinsey Economic Potential of GenAI, 2023", year: 2023 },
      { category: "Data Entry", metric: "Data processing automation", lowPct: 50, highPct: 70, source: "Forrester AI Predictions, 2024", year: 2024 },
      { category: "Communication", metric: "Email/messaging time reduction", lowPct: 20, highPct: 35, source: "Microsoft Work Trend Index, 2024", year: 2024 },
      { category: "Decision Making", metric: "Decision-making speed improvement", lowPct: 15, highPct: 30, source: "Bain & Company AI Survey, 2024", year: 2024 },
    ],
    defaultGainPct: 30,
  },
];

/**
 * Match a product description/features to the best industry profile.
 * Uses keyword scoring — higher score = better match.
 */
export function matchIndustryProfile(text: string): IndustryProfile {
  const lower = text.toLowerCase();
  let bestMatch = INDUSTRY_PROFILES[INDUSTRY_PROFILES.length - 1]; // default: general
  let bestScore = 0;

  for (const profile of INDUSTRY_PROFILES) {
    const score = profile.keywords.reduce((sum, kw) => {
      return sum + (lower.includes(kw) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = profile;
    }
  }

  return bestMatch;
}

/**
 * Get relevant benchmarks for rationale generation.
 * Returns top N benchmarks from the matched industry profile.
 */
export function getRelevantBenchmarks(
  productDescription: string,
  maxBenchmarks = 3
): { profile: IndustryProfile; benchmarks: Benchmark[] } {
  const profile = matchIndustryProfile(productDescription);
  return {
    profile,
    benchmarks: profile.benchmarks.slice(0, maxBenchmarks),
  };
}

/**
 * Format a benchmark for use in rationale text.
 */
export function formatBenchmarkCitation(benchmark: Benchmark): string {
  return `${benchmark.lowPct}-${benchmark.highPct}% ${benchmark.metric.toLowerCase()} (${benchmark.source})`;
}

/**
 * Generate a default gain percentage suggestion based on product analysis.
 */
export function suggestGainPercentage(productDescription: string): number {
  const profile = matchIndustryProfile(productDescription);
  return profile.defaultGainPct;
}
