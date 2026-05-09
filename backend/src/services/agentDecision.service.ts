import {
  AgentActionProfile,
  AgentCandidateAction,
  AgentRecommendInput,
  AgentRecommendationResult
} from "../types/agent.types";
import { profileCliCommand } from "./cliProfiler.service";
import { profileMcpToolCall } from "./mcpProfiler.service";
import { buildAgentRecommendationResponse } from "./agentResponse.service";

const getProfileCost = (profile: any): number => {
  if (profile?.cost?.totalCost && typeof profile.cost.totalCost === "number") {
    return profile.cost.totalCost;
  }

  if (
    profile?.cost?.totalCost === 0 ||
    profile?.cost?.totalCost === "0"
  ) {
    return 0;
  }

  return 0;
};

const profileCliCandidateAction = async (
  action: Extract<AgentCandidateAction, { type: "cli" }>,
  modelId: string
): Promise<AgentActionProfile> => {
  try {
    const profile = await profileCliCommand({
      command: action.command,
      mode: action.mode,
      modelId
    });

    return {
      id: action.id,
      type: "cli",
      status: "success",
      totalTokens: profile.totalTokens,
      estimatedCost: getProfileCost(profile),
      rawProfile: profile
    };
  } catch (error) {
    return {
      id: action.id,
      type: "cli",
      status: "failed",
      totalTokens: Number.MAX_SAFE_INTEGER,
      estimatedCost: Number.MAX_SAFE_INTEGER,
      reason:
        error instanceof Error
          ? error.message
          : "Failed to profile CLI action."
    };
  }
};

const profileMcpCandidateAction = async (
  action: Extract<AgentCandidateAction, { type: "mcp" }>,
  modelId: string
): Promise<AgentActionProfile> => {
  try {
    const profile = await profileMcpToolCall({
      serverId: action.serverId,
      toolName: action.toolName,
      arguments: action.arguments,
      modelId
    });

    return {
      id: action.id,
      type: "mcp",
      status: "success",
      totalTokens: profile.totalTokens,
      estimatedCost: getProfileCost(profile),
      rawProfile: profile
    };
  } catch (error) {
    return {
      id: action.id,
      type: "mcp",
      status: "failed",
      totalTokens: Number.MAX_SAFE_INTEGER,
      estimatedCost: Number.MAX_SAFE_INTEGER,
      reason:
        error instanceof Error
          ? error.message
          : "Failed to profile MCP action."
    };
  }
};

const profileCandidateAction = async (
  action: AgentCandidateAction,
  modelId: string
): Promise<AgentActionProfile> => {
  if (action.type === "cli") {
    return profileCliCandidateAction(action, modelId);
  }

  return profileMcpCandidateAction(action, modelId);
};

export const recommendAgentAction = async (
  input: AgentRecommendInput
): Promise<AgentRecommendationResult> => {
  const actionProfiles = await Promise.all(
    input.candidateActions.map((action) =>
      profileCandidateAction(action, input.modelId)
    )
  );

  return buildAgentRecommendationResponse(input.task, actionProfiles);
};
