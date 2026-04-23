import { NextRequest } from "next/server";
import { getModel } from "@/lib/models";
import { callLLM } from "@/lib/llm";
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { content, modelId } = await request.json();

    if (!content || !modelId) {
      return Response.json(
        { error: "content and modelId are required" },
        { status: 400 }
      );
    }

    const model = getModel(modelId);
    const result = await callLLM(
      model,
      ANALYZE_SYSTEM_PROMPT,
      `Analyze these expenses and return the structured JSON analysis:\n\n${content}`
    );

    let analysis;
    try {
      let raw = result.content.trim();
      if (raw.startsWith("```")) {
        raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      }
      analysis = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "Failed to parse analysis. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ analysis });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json({ error: message }, { status: 500 });
  }
}
