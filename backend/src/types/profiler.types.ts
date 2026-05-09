export interface TokenBreakdown {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export interface CliProfileInput {
  command: string;
  mode: "manual" | "sandbox";
  modelId: string;
}

export interface CliProfileResult {
  type: "cli";
  command: string;
  mode: "manual" | "sandbox";
  executed: boolean;
  stdout: string;
  stderr: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: CostBreakdown;
}

export interface McpProfileInput {
  serverId: string;
  toolName: string;
  arguments: Record<string, unknown>;
  modelId: string;
}

export interface McpProfileResult {
  type: "mcp";
  serverId: string;
  toolName: string;
  arguments: Record<string, unknown>;
  result: unknown;
  requestTokens: number;
  resultTokens: number;
  totalTokens: number;
  cost: CostBreakdown;
}

export interface CompareProfileInput {
  taskName?: string;
  modelId: string;
  cliOption: {
    command: string;
    mode: "manual" | "sandbox";
  };
  mcpOption: {
    serverId: string;
    toolName: string;
    arguments: Record<string, unknown>;
  };
}

export interface ProfileRequest {
  command: string;
  modelId?: string;
}

export interface ComparisonProfileRequest {
  cliCommand: string;
  mcpCommand: string;
  modelId?: string;
}

export interface EstimatedCost {
  totalCost: number;
  inputCost: number;
  outputCost: number;
  inputTokens: number;
  outputTokens: number;
}

export interface ProfileResponse {
  command: string;
  estimatedTokens: number;
  estimatedCost: EstimatedCost;
}

export interface ComparisonResult {
  modelId: string;
  modelName: string;
  cli: ProfileResponse;
  mcp: ProfileResponse;
  tokenDifference: number;
  costDifference: number;
  savings: {
    amountSaved: number;
    percentageSaved: number;
  };
  recommendation: {
    recommendedOption: "CLI" | "MCP" | "Equal";
    reason: string;
  };
}