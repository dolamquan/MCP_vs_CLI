import { callMcpTool } from "./mcpTool.service";
import { countTokens } from "./tokenCounter.service";
import { estimateCost } from "./costEstimator.service";
import { McpProfileInput, McpProfileResult } from "../types/profiler.types";

export const profileMcpToolCall = async (
  input: McpProfileInput
): Promise<McpProfileResult> => {
  const requestPayload = {
    serverId: input.serverId,
    toolName: input.toolName,
    arguments: input.arguments
  };

  const result = await callMcpTool({
    serverId: input.serverId,
    toolName: input.toolName,
    arguments: input.arguments
  });

  const requestTokens = countTokens(JSON.stringify(requestPayload));
  const resultTokens = countTokens(JSON.stringify(result));

  const cost = estimateCost(requestTokens, resultTokens, input.modelId);

  return {
    type: "mcp",
    serverId: input.serverId,
    toolName: input.toolName,
    arguments: input.arguments,
    result,
    requestTokens,
    resultTokens,
    totalTokens: requestTokens + resultTokens,
    cost
  };
};