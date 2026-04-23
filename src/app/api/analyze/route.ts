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
      analysis = extractJsonObject(result.content);
    } catch (err) {
      return Response.json(
        {
          error: `Failed to parse analysis: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
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

function extractJsonObject<T = unknown>(raw: string): T {
  let s = raw.trim();

  // Strip code fences
  if (s.startsWith("```")) {
    s = s
      .replace(/^```(?:json|JSON)?\s*/i, "")
      .replace(/```[\s\S]*$/, "")
      .trim();
  }

  // Fast path
  if (s.startsWith("{")) {
    try {
      return JSON.parse(s) as T;
    } catch {
      // fall through to bracket scan
    }
  }

  // Find first { and its matching }
  const start = s.indexOf("{");
  if (start === -1) {
    throw new Error(
      `No JSON object found. First 200 chars: ${s.slice(0, 200)}`
    );
  }

  let depth = 0;
  let inString = false;
  let stringChar = "";
  let escape = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(s.slice(start, i + 1)) as T;
      }
    }
  }

  throw new Error("Unterminated JSON in response (likely truncated)");
}
