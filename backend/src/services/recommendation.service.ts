import {
  RecommendationInput,
  RecommendationResult
} from "../types/recommendation.types";

export const getRecommendation = (
  input: RecommendationInput
): RecommendationResult => {
  const { clitokens, mcptokens, cliCost, mcpCost } = input;

  if (clitokens === mcptokens && cliCost === mcpCost) {
    return {
      recommendedOption: "Equal",
      reason: "Both CLI and MCP have the same estimated token usage and cost."
    };
  }

  if (clitokens < mcptokens && cliCost <= mcpCost) {
    return {
      recommendedOption: "CLI",
      reason: "CLI is more efficient because it uses fewer estimated tokens and has a lower estimated cost."
    };
  }

  if (mcptokens < clitokens && mcpCost <= cliCost) {
    return {
      recommendedOption: "MCP",
      reason: "MCP is more efficient because it uses fewer estimated tokens and has a lower estimated cost."
    };
  }

  if (cliCost < mcpCost) {
    return {
      recommendedOption: "CLI",
      reason: "CLI is recommended because it has the lower estimated cost."
    };
  }

  return {
    recommendedOption: "MCP",
    reason: "MCP is recommended because it has the lower estimated cost."
  };
};