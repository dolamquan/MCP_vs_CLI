import { CliProfileResult, McpProfileResult, ComparisonResult, EstimatedCost } from "../types/profiler.types";

const transformCostBreakdown = (
  inputTokens: number,
  outputTokens: number,
  cost: { inputCost: number; outputCost: number; totalCost: number }
): EstimatedCost => {
  return {
    inputTokens,
    outputTokens,
    inputCost: cost.inputCost,
    outputCost: cost.outputCost,
    totalCost: cost.totalCost,
  };
};

export const transformToComparisonResult = (
  cli: CliProfileResult,
  mcp: McpProfileResult,
  modelId: string,
  modelName: string
): ComparisonResult => {
  const cliEstimatedCost = transformCostBreakdown(
    cli.inputTokens,
    cli.outputTokens,
    cli.cost
  );

  const mcpEstimatedCost = transformCostBreakdown(
    mcp.requestTokens,
    mcp.resultTokens,
    mcp.cost
  );

  const tokenDifference = Math.abs(cli.totalTokens - mcp.totalTokens);
  const costDifference = Math.abs(cli.cost.totalCost - mcp.cost.totalCost);

  const recommendedOption =
    cli.totalTokens < mcp.totalTokens
      ? "CLI"
      : mcp.totalTokens < cli.totalTokens
        ? "MCP"
        : "Equal";

  const percentageSaved =
    recommendedOption === "Equal"
      ? 0
      : tokenDifference / Math.max(cli.totalTokens, mcp.totalTokens) * 100;

  const amountSaved = Math.abs(
    cli.cost.totalCost - mcp.cost.totalCost
  );

  return {
    modelId,
    modelName,
    cli: {
      command: cli.command,
      estimatedTokens: cli.totalTokens,
      estimatedCost: cliEstimatedCost,
    },
    mcp: {
      command: `${mcp.toolName}`,
      estimatedTokens: mcp.totalTokens,
      estimatedCost: mcpEstimatedCost,
    },
    tokenDifference,
    costDifference,
    savings: {
      amountSaved,
      percentageSaved,
    },
    recommendation: {
      recommendedOption,
      reason:
        recommendedOption === "CLI"
          ? "CLI used fewer total tokens than MCP for this task."
          : recommendedOption === "MCP"
            ? "MCP used fewer total tokens than CLI for this task."
            : "CLI and MCP used the same number of tokens.",
    },
  };
};
