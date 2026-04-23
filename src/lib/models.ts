import { AIModel } from "./types";

export const AI_MODELS: AIModel[] = [
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
    modelId: "claude-sonnet-4-6",
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    modelId: "claude-haiku-4-5",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    modelId: "gpt-4o",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    modelId: "gpt-4o-mini",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "openrouter",
    modelId: "deepseek/deepseek-chat",
  },
];

export function getModel(id: string): AIModel {
  const model = AI_MODELS.find((m) => m.id === id);
  if (!model) throw new Error(`Unknown model: ${id}`);
  return model;
}
