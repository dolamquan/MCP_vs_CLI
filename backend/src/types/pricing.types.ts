export type ModelProvider = "OpenAI" | "Anthropic" | "Google";

export interface PricingConfig {
  modelId: string;
  modelName: string;
  provider: ModelProvider;
  inputCostPer1MTokens: number;
  outputCostPer1MTokens: number;
}

export interface CostEstimate {
  modelId: string;
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}