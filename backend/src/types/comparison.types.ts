import { CostEstimate } from "./pricing.types";
import { RecommendationResult } from "./recommendation.types";

export interface CommandInput {
  cliCommand: string;
  mcpCommand: string;
  modelId?: string;
}

export interface CommandUsage {
  command: string;
  estimatedTokens: number;
  estimatedCost: CostEstimate;
}

export interface SavingsResult {
  amountSaved: number;
  percentageSaved: number;
}

export interface ComparisonResult {
  modelId: string;
  modelName: string;
  cli: CommandUsage;
  mcp: CommandUsage;
  tokenDifference: number;
  costDifference: number;
  savings: SavingsResult;
  recommendation: RecommendationResult;
}