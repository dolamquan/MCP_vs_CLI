import { getMcpServerById } from "../config/mcp.config";
import {
  McpProfiledToolCallResult,
  McpToolCallInput
} from "../types/mcp.types";
import { countTokens } from "./tokenCounter.service";
import { callMcpTool } from "./mcpTool.service";

export const profileMcpToolCall = async (
  input: McpToolCallInput
): Promise<McpProfiledToolCallResult> => {
  const server = getMcpServerById(input.serverId);

  if (!server) {
    throw new Error(`MCP server "${input.serverId}" was not found or is disabled.`);
  }

  const requestPayload = {
    serverId: input.serverId,
    toolName: input.toolName,
    arguments: input.arguments
  };

  const result = await callMcpTool(input);

  const requestTokens = countTokens(JSON.stringify(requestPayload));
  const resultTokens = countTokens(JSON.stringify(result));

  return {
    serverId: server.serverId,
    serverName: server.serverName,
    transport: server.transport,
    toolName: input.toolName,
    arguments: input.arguments,
    requestTokens,
    resultTokens,
    totalTokens: requestTokens + resultTokens,
    result
  };
};