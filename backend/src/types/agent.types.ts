export type AgentActionType = "cli" | "mcp";

export type AgentActionStatus = "success" | "failed";

export type AgentConfidence = "low" | "medium" | "high";

export interface AgentCliCandidateAction {
  id: string;
  type: "cli";
  command: string;
  mode: "manual" | "sandbox";
}

export interface AgentMcpCandidateAction {
  id: string;
  type: "mcp";
  serverId: string;
  toolName: string;
  arguments: Record<string, unknown>;
}

export type AgentCandidateAction =
  | AgentCliCandidateAction
  | AgentMcpCandidateAction;

export interface AgentRecommendInput {
  task: string;
  modelId: string;
  candidateActions: AgentCandidateAction[];
}

export interface AgentActionProfile {
  id: string;
  type: AgentActionType;
  status: AgentActionStatus;
  totalTokens: number;
  estimatedCost: number;
  reason?: string;
  rawProfile?: unknown;
}

export interface AgentRecommendationDifference {
  tokenDifference: number;
  percentageSaved: number;
  costDifference: number;
}

export interface AgentAdvice {
  shouldUseRecommended: boolean;
  summary: string;
  fallbackActionId: string | null;
}

export interface AgentRecommendationResult {
  task: string;
  recommendedActionId: string | null;
  recommendedType: AgentActionType | null;
  reason: string;
  confidence: AgentConfidence;
  difference: AgentRecommendationDifference;
  agentAdvice: AgentAdvice;
  actions: AgentActionProfile[];
}