import { PricingConfig } from "../types/pricing.types";

export const MODEL_PRICING_CONFIG: PricingConfig[] = [
  {
    modelId: "gpt-4.1",
    modelName: "GPT-4.1",
    provider: "OpenAI",
    inputCostPer1MTokens: 2.0,
    outputCostPer1MTokens: 8.0
  },
  {
    modelId: "gpt-4.1-mini",
    modelName: "GPT-4.1 Mini",
    provider: "OpenAI",
    inputCostPer1MTokens: 0.4,
    outputCostPer1MTokens: 1.6
  },
  {
    modelId: "claude-sonnet",
    modelName: "Claude Sonnet",
    provider: "Anthropic",
    inputCostPer1MTokens: 3.0,
    outputCostPer1MTokens: 15.0
  },
  {
    modelId: "claude-haiku",
    modelName: "Claude Haiku",
    provider: "Anthropic",
    inputCostPer1MTokens: 0.8,
    outputCostPer1MTokens: 4.0
  },
  {
    modelId: "gemini-pro",
    modelName: "Gemini Pro",
    provider: "Google",
    inputCostPer1MTokens: 1.25,
    outputCostPer1MTokens: 5.0
  }
];

export const DEFAULT_MODEL_ID = "gpt-4.1-mini";