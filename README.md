# Value Calculator

AI-powered ROI modeling tool for Solutions Engineers. Analyze any product URL, auto-generate use cases, and export branded PDF reports with advanced financial metrics.

**Live Demo**: [value-calculator-eta.vercel.app](https://value-calculator-eta.vercel.app)

## SE Workflow

### Pre-Demo
1. Go to the [Dashboard](https://value-calculator-eta.vercel.app/dashboard) and select a template matching the prospect's industry
2. Or start fresh — paste the prospect's product URL and let AI analyze it
3. Customize company branding in [Settings](https://value-calculator-eta.vercel.app/settings) (logo, colors, company name)
4. Review the auto-generated use cases and tweak efficiency gains per role

### Demo
1. Walk the prospect through the 3-step wizard: Product Discovery → Use Case Builder → Results Dashboard
2. Toggle metrics on/off to focus on what matters: ROI, NPV, IRR, TCO, Payback Period
3. Use the sensitivity slider to model different discount rates live
4. Show the projection charts and breakdown visualizations
5. Export a branded 5-page PDF report on the spot

### Post-Demo
1. Send the exported PDF to stakeholders
2. Adjust assumptions based on feedback and re-export
3. Use the saved calculator from the dashboard for follow-up meetings

## Features
- AI product analysis via Claude (paste any URL)
- 13 pre-built templates (4 AI-powered, 9 industry-specific)
- Advanced metrics: ROI, NPV, IRR, TCO, break-even, cost of delay
- Multi-role and multi-stage modeling
- Sensitivity analysis with adjustable discount rates
- Branded 5-page PDF export
- White-label settings (logo, colors, company name)
- Dark theme UI

## Tech Stack
Next.js 16 | React 19 | TypeScript | Tailwind CSS 4 | Claude AI | Recharts | React-PDF

## Setup
```bash
npm install
npm run dev
```

Requires `ANTHROPIC_API_KEY` environment variable for AI features.
