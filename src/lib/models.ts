import { AIModel } from "./types";

export const AI_MODELS: AIModel[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
    modelId: "claude-sonnet-4-6",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    modelId: "claude-haiku-4-5",
  },
  {
    id: "gpt-5-4",
    name: "GPT-5.4",
    provider: "openai",
    modelId: "gpt-5.4",
  },
  {
    id: "gpt-5-4-mini",
    name: "GPT-5.4 Mini",
    provider: "openai",
    modelId: "gpt-5.4-mini",
  },
  {
    id: "gpt-5-4-nano",
    name: "GPT-5.4 Nano",
    provider: "openai",
    modelId: "gpt-5.4-nano",
  },
  {
    id: "deepseek-v3-2",
    name: "DeepSeek V3.2",
    provider: "openrouter",
    modelId: "deepseek/deepseek-v3.2",
  },
  {
    id: "kimi-k2-6",
    name: "Kimi K2.6",
    provider: "openrouter",
    modelId: "moonshotai/kimi-k2.6",
  },
  {
    id: "minimax-m2-5",
    name: "MiniMax M2.5",
    provider: "openrouter",
    modelId: "minimax/minimax-m2.5",
  },
];

export function getModel(id: string): AIModel {
  const model = AI_MODELS.find((m) => m.id === id);
  if (!model) throw new Error(`Unknown model: ${id}`);
  return model;
}
