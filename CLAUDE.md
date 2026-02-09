# CLAUDE.md — Value Calculator v3

## What This Is
An AI-powered ROI modeling tool with a 5-step wizard flow. Users enter a product URL, the system analyzes it, auto-generates use cases with data-driven rationale, and outputs an interactive finance dashboard with toggleable metrics (ROI, NPV, IRR, TCO, break-even). Includes soft benefits analysis (risk exposure, tech debt, compliance impact) and 13 pre-built industry templates.

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 (**NEVER** use custom `*` CSS reset or arbitrary bracket values like `bg-[#hex]`)
- `@anthropic-ai/sdk` for AI product analysis and use case generation (server-side)
- `cheerio` for HTML scraping/parsing
- `@react-pdf/renderer` for PDF report generation (5-page slide deck)
- Recharts for data visualizations (bar, pie, line charts)
- Framer Motion for wizard step transitions
- Lucide React for icons

## Theme
- **Light theme** — white background (#f8fafc), blue primary (#2563eb)
- Token system in `globals.css` via CSS custom properties
- Chart tooltips use hardcoded light styles (white bg, slate text)

## Key Architecture

### Routes (`src/app/`)
- `/` — Landing page
- `/dashboard` — List of saved calculators + 13 templates
- `/calculator/new` — Creates wizard-mode calculator
- `/calculator/[id]` — Wizard (5 steps) or editor mode
- `/calculator/[id]/pdf` — 5-page PDF slide deck
- `/settings` — White-label settings (logo, colors, company name)
- `/api/scrape` — POST: Scrape product URL with cheerio
- `/api/analyze` — POST: Claude analyzes scraped content → ProductAnalysis
- `/api/generate-use-cases` — POST: Claude generates Stage[] from product
- `/api/generate-rationale` — POST: Claude writes data-driven rationale

### Components (`src/components/`)
- `Header.tsx` — App navigation header
- `CalculatorCard.tsx` — Dashboard card for saved calculators
- `TemplateCard.tsx` — Template selector card
- `StagesTable.tsx` — Table of stages in editor mode
- `StageRow.tsx` — Individual stage row
- `AssumptionsPanel.tsx` — Editable assumptions/inputs
- `SummaryPanel.tsx` — Sidebar ROI summary with charts
- `GainSlider.tsx` — Baseline + gain percentage slider per role

### Wizard Components (`src/components/wizard/`)
- `StepIndicator.tsx` — 5-step horizontal stepper
- `ProductDiscovery.tsx` — URL input + AI product analysis
- `UseCaseBuilder.tsx` — AI-generated use case cards
- `ResultsDashboard.tsx` — Full-page finance dashboard with toggleable metrics
- `MetricCard.tsx` — Single metric with toggle visibility
- `SensitivitySlider.tsx` — Discount rate slider for NPV sensitivity

### Lib (`src/lib/`)
- `calculator.ts` — Core ROI logic (calculateStage, calculateSummary, formatCurrency)
- `advanced-calculator.ts` — NPV, IRR, TCO, break-even, sensitivity analysis
- `templates.ts` — 13 pre-built templates (4 AI, 9 industry-specific)
- `benchmarks.ts` — Curated industry benchmarks with source citations
- `storage.ts` — localStorage persistence with v1→v2→v3 schema migration
- `types.ts` — All TypeScript interfaces
- `pdf-generator.tsx` — PDF slide deck renderer

### Hooks (`src/hooks/`)
- `useCalculator.ts` — Calculator CRUD state management

## Data Model
- Schema v3 (auto-migrates from v1/v2)
- `Stage` has soft benefits: `softBenefits[]` with type, description, impactPct
- `Calculator` has optional `productAnalysis`, `wizardState`
- Storage: localStorage only
- No authentication (API routes are unprotected)

## Finance Formulas
- **NPV** = Σ(CF_t / (1+r)^t) with ramp factors (70%, 100%, 107%, 110%, 112%)
- **IRR** = Binary search for rate where NPV = 0
- **TCO** = toolCost × years + 15% implementation + 5% training
- **Break-even** = Month where cumulative savings > cumulative costs
- **Sensitivity** = NPV recalculated across discount rate range (5-20%)

## Commands
```bash
npm run dev
npm run build
npm run lint
```

## Known Security Notes
- API routes have no auth — add middleware before production
- SSRF protection on /api/scrape needs IP/domain blocklist hardening
- Error responses should be sanitized for production
- localStorage stores calculator data unencrypted

## Conventions
- Accent: blue (`--color-primary: #2563eb`)
- Light theme throughout
- Wizard flow for new calculators; editor mode for saved ones
- AI features degrade gracefully — no API key = manual mode
- Templates use `buildTemplate()` helper with role pairs and stage data
