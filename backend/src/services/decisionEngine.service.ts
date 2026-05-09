import { profileCliCommand } from "./cliProfiler.service";
import { profileMcpToolCall } from "./mcpProfiler.service";
import { CompareProfileInput } from "../types/profiler.types";

export const compareCliVsMcp = async (input: CompareProfileInput) => {
  const cli = await profileCliCommand({
    command: input.cliOption.command,
    mode: input.cliOption.mode,
    modelId: input.modelId
  });

  const mcp = await profileMcpToolCall({
    serverId: input.mcpOption.serverId,
    toolName: input.mcpOption.toolName,
    arguments: input.mcpOption.arguments,
    modelId: input.modelId
  });

  const tokenDifference = Math.abs(cli.totalTokens - mcp.totalTokens);

  const cheaperOption =
    cli.totalTokens < mcp.totalTokens
      ? "CLI"
      : mcp.totalTokens < cli.totalTokens
        ? "MCP"
        : "Equal";

  const percentageSaved =
    cheaperOption === "Equal"
      ? 0
      : tokenDifference / Math.max(cli.totalTokens, mcp.totalTokens) * 100;

  const costDifference = Math.abs(cli.cost.totalCost - mcp.cost.totalCost);

  return {
    taskName: input.taskName || null,
    recommendedOption: cheaperOption,
    reason:
      cheaperOption === "CLI"
        ? "CLI used fewer total tokens than MCP for this task."
        : cheaperOption === "MCP"
          ? "MCP used fewer total tokens than CLI for this task."
          : "CLI and MCP used the same number of tokens.",
    cli,
    mcp,
    difference: {
      tokenDifference,
      percentageSaved,
      costDifference
    }
  };
};