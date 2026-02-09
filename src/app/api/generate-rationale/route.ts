import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ProductAnalysis, Stage } from "@/lib/types";
import { getRelevantBenchmarks, formatBenchmarkCitation } from "@/lib/benchmarks";

const SYSTEM_PROMPT = `You are a business value consultant. Write a concise, data-driven rationale for a specific use case in an ROI analysis. The rationale should be 2-3 sentences, cite industry benchmarks, and be persuasive for a CFO audience. Return plain text only, no JSON.`;

const USER_PROMPT = (
  stage: Stage,
  product: ProductAnalysis,
  benchmarkInfo: string
) => `Write a rationale for this use case:

Use case: ${stage.name}
Workflow: ${stage.workflow}
Current assumptions: ${stage.assumptions}
Product: ${product.name} — ${product.description}

Industry benchmarks:
${benchmarkInfo}

Write 2-3 sentences of data-driven rationale. Cite specific benchmark numbers. Be concrete, not vague.`;

export async function POST(req: NextRequest) {
  try {
    const { stage, productAnalysis } = await req.json();

    if (!stage || !productAnalysis) {
      return NextResponse.json({ success: false, error: "Stage and product analysis are required" }, { status: 400 });
    }

    const product = productAnalysis as ProductAnalysis;
    const typedStage = stage as Stage;
    const { benchmarks } = getRelevantBenchmarks(
      `${product.name} ${product.description} ${typedStage.name} ${typedStage.workflow}`
    );

    const benchmarkInfo = benchmarks.map((b) => `- ${formatBenchmarkCitation(b)}`).join("\n");

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      const anthropic = new Anthropic({ apiKey });

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: USER_PROMPT(typedStage, product, benchmarkInfo) }],
      });

      const rationale = message.content[0].type === "text" ? message.content[0].text.trim() : "";

      return NextResponse.json({ success: true, rationale, mode: "ai" });
    }

    // Fallback — template rationale from benchmarks
    const topBenchmark = benchmarks[0];
    const rationale = topBenchmark
      ? `Industry research indicates ${formatBenchmarkCitation(topBenchmark)}. By implementing ${product.name}, organizations can expect similar efficiency gains in ${typedStage.name.toLowerCase()} workflows. These estimates are conservative and based on peer-reviewed industry data.`
      : `Based on cross-industry analysis, automation tools like ${product.name} typically deliver 25-42% time savings in knowledge work tasks (McKinsey Global Institute, 2023). Actual results will vary based on implementation maturity and organizational adoption.`;

    return NextResponse.json({ success: true, rationale, mode: "fallback" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rationale generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
