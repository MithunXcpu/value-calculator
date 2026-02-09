import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ProductAnalysis, Stage, RoleAllocation, Role } from "@/lib/types";
import { getRelevantBenchmarks, formatBenchmarkCitation } from "@/lib/benchmarks";

const SYSTEM_PROMPT = `You are a business value consultant specializing in ROI analysis. Generate realistic use cases showing how a product saves time and money. Each use case should describe a specific workflow, not a generic benefit. Return ONLY valid JSON with no markdown formatting.`;

const USER_PROMPT = (
  product: ProductAnalysis,
  roles: Role[],
  benchmarkInfo: string
) => `Generate 4-6 use cases for "${product.name}" as JSON.

Product: ${product.description}
Features: ${product.features.join(", ")}
Target users: ${product.targetUsers.join(", ")}
Pain points: ${product.painPoints.join(", ")}

Available roles: ${roles.map((r) => `${r.label} ($${r.hourlyRate}/hr)`).join(", ")}

Industry benchmarks for context:
${benchmarkInfo}

Return a JSON array of use cases:
[
  {
    "name": "Use Case Name",
    "workflow": "Brief description of the workflow",
    "assumptions": "Key assumption about current process",
    "rationale": "Data-driven rationale citing benchmarks where relevant. 2-3 sentences.",
    "roleAllocations": [
      { "roleId": "ROLE_ID", "baseline": HOURS_PER_WEEK_BEFORE, "gain": PERCENTAGE_REDUCTION }
    ],
    "peopleAffected": NUMBER_OF_PEOPLE
  }
]

Use these exact roleIds: ${roles.map((r) => `"${r.id}" for ${r.label}`).join(", ")}

Guidelines:
- baseline = weekly hours spent on this task BEFORE the tool (realistic: 2-20 hrs)
- gain = percentage reduction (realistic: 20-60% based on benchmarks)
- peopleAffected = how many people do this task (realistic: 1-50)
- rationale should cite specific benchmark data where relevant`;

export async function POST(req: NextRequest) {
  try {
    const { productAnalysis, roles } = await req.json();

    if (!productAnalysis || !roles || !Array.isArray(roles)) {
      return NextResponse.json({ success: false, error: "Product analysis and roles are required" }, { status: 400 });
    }

    const product = productAnalysis as ProductAnalysis;
    const typedRoles = roles as Role[];
    const { profile, benchmarks } = getRelevantBenchmarks(
      `${product.name} ${product.description} ${product.features.join(" ")}`
    );

    const benchmarkInfo = benchmarks.map((b) => `- ${formatBenchmarkCitation(b)}`).join("\n");

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      const anthropic = new Anthropic({ apiKey });

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: USER_PROMPT(product, typedRoles, benchmarkInfo) }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";
      const jsonMatch = text.match(/\[[\s\S]*\]/);

      if (!jsonMatch) {
        return NextResponse.json({ success: false, error: "Failed to parse AI response" }, { status: 500 });
      }

      const rawCases = JSON.parse(jsonMatch[0]);

      // Convert to proper Stage objects
      const stages: Stage[] = rawCases.map((uc: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        name: uc.name as string,
        workflow: (uc.workflow as string) || "",
        assumptions: (uc.assumptions as string) || "",
        rationale: (uc.rationale as string) || "",
        peopleAffected: (uc.peopleAffected as number) || 5,
        roleAllocations: ((uc.roleAllocations as Record<string, unknown>[]) || []).map(
          (ra) =>
            ({
              roleId: ra.roleId as string,
              baseline: ra.baseline as number,
              gain: ra.gain as number,
            }) as RoleAllocation
        ),
      }));

      return NextResponse.json({
        success: true,
        stages,
        industryProfile: profile.name,
        mode: "ai",
      });
    }

    // Fallback — generate template use cases from benchmarks
    const defaultGain = profile.defaultGainPct;
    const stages: Stage[] = benchmarks.slice(0, 4).map((b) => ({
      id: crypto.randomUUID(),
      name: b.category,
      workflow: `${b.metric} using ${product.name}`,
      assumptions: `Based on ${profile.name} industry benchmarks`,
      rationale: `Industry data suggests ${formatBenchmarkCitation(b)}. Adjust the gain percentage based on your organization's specific context.`,
      peopleAffected: 5,
      roleAllocations: typedRoles.map((r) => ({
        roleId: r.id,
        baseline: 8,
        gain: defaultGain,
      })),
    }));

    return NextResponse.json({
      success: true,
      stages,
      industryProfile: profile.name,
      mode: "fallback",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
