# CLAUDE.md — Value Calculator

## What This Is
An ROI modeling and value calculator tool that lets users build, customize, and export business value assessments with PDF report generation.

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 (**NEVER** use custom `*` CSS reset or arbitrary bracket values like `bg-[#hex]`)
- Clerk (`@clerk/nextjs`) for authentication
- Supabase (`@supabase/supabase-js`) for database/storage
- `@react-pdf/renderer` for PDF report generation
- Recharts for data visualizations
- Framer Motion for animations
- Lucide React for icons

## Key Architecture

### Routes (`src/app/`)
- `/` — Landing page
- `/dashboard` — List of saved calculators/models
- `/calculator/new` — Create a new value calculation
- `/calculator/[id]` — Edit/view a specific calculator
- `/calculator/[id]/pdf` — PDF export/preview for a calculator
- `/settings` — User settings

### Components (`src/components/`)
- `Header.tsx` — App navigation header
- `CalculatorCard.tsx` — Dashboard card for each saved calculator
- `TemplateCard.tsx` — Pre-built calculator template selector
- `StagesTable.tsx` — Table of value calculation stages
- `StageRow.tsx` — Individual stage row within the table
- `AssumptionsPanel.tsx` — Editable assumptions/inputs panel
- `SummaryPanel.tsx` — ROI summary and results display

### Lib (`src/lib/`)
- `calculator.ts` — Core calculation/ROI logic
- `templates.ts` — Pre-built calculator templates
- `storage.ts` — Supabase data layer
- `types.ts` — TypeScript type definitions

## Commands
```bash
npm run dev
npm run build
npm run lint
```

## Conventions
- Accent color: blue (`--color-primary`)
- Dark theme throughout
- Calculator flow: select template -> customize assumptions -> view results -> export PDF
- PDF generation uses `@react-pdf/renderer` (server-side capable)
- Supabase for persisting calculator models
