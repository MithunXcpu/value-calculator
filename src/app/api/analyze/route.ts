import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ProductAnalysis } from "@/lib/types";

const SYSTEM_PROMPT = `You are a product analyst. Given scraped website content, extract a structured analysis of the product/service. Be concise and specific. Return ONLY valid JSON with no markdown formatting.`;

const USER_PROMPT = (content: string) => `Analyze this product/service from its website content and return a JSON object with these fields:
{
  "name": "Product name",
  "description": "One-paragraph description of what the product does and who it's for",
  "features": ["Feature 1", "Feature 2", ...],  // 4-8 key features
  "targetUsers": ["User type 1", "User type 2", ...],  // 3-5 target user personas
  "painPoints": ["Pain point 1", "Pain point 2", ...]  // 3-5 problems the product solves
}

Website content:
${content}`;

export async function POST(req: NextRequest) {
  try {
    const { scrapedContent, url } = await req.json();

    if (!scrapedContent || typeof scrapedContent !== "object") {
      return NextResponse.json({ success: false, error: "Scraped content is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // AI mode — use Claude
    if (apiKey) {
      const anthropic = new Anthropic({ apiKey });

      const combinedContent = [
        scrapedContent.title && `Title: ${scrapedContent.title}`,
        scrapedContent.description && `Description: ${scrapedContent.description}`,
        scrapedContent.headings?.length && `Headings: ${scrapedContent.headings.join(", ")}`,
        scrapedContent.features?.length && `Listed features: ${scrapedContent.features.slice(0, 15).join("; ")}`,
        scrapedContent.content && `Page content: ${scrapedContent.content.slice(0, 5000)}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: USER_PROMPT(combinedContent) }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";

      // Parse JSON from response (handle potential markdown wrapping)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({ success: false, error: "Failed to parse AI response" }, { status: 500 });
      }

      const analysis: ProductAnalysis = {
        ...JSON.parse(jsonMatch[0]),
        sourceUrl: url || scrapedContent.url,
        analyzedAt: new Date().toISOString(),
      };

      return NextResponse.json({ success: true, analysis, mode: "ai" });
    }

    // Fallback mode — extract from scraped data without AI
    const analysis: ProductAnalysis = {
      name: scrapedContent.title || "Unknown Product",
      description: scrapedContent.description || "Product description not available. Please enter manually.",
      features: (scrapedContent.features || []).slice(0, 6),
      targetUsers: [],
      painPoints: [],
      sourceUrl: url || scrapedContent.url,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, analysis, mode: "fallback" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
