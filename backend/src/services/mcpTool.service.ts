import { getEnabledMcpServers } from "../config/mcp.config";
import { createConnectedMcpClient } from "./mcpClient.service";
import { McpToolCallInput, McpToolSummary } from "../types/mcp.types";


// .map(): Goes through an array and creates a new array by transforming each item
/**
 * Simple idea: take each item, change it, and return a new array
 */


export const listMcpServers = () => {
  return getEnabledMcpServers().map((server) => {
    if (server.transport === "stdio") {
      return {
        serverId: server.serverId,
        serverName: server.serverName,
        transport: server.transport,
        command: server.command,
        args: server.args
      };
    }

    return {
      serverId: server.serverId,
      serverName: server.serverName,
      transport: server.transport,
      url: server.url
    };
  });
};

export const listMcpTools = async (
  serverId: string
): Promise<McpToolSummary[]> => {
  const { client } = await createConnectedMcpClient(serverId);

  try {
    const response = await client.listTools();

    return response.tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      };
    });
  } finally {
    await client.close();
  }
};

export const callMcpTool = async (input: McpToolCallInput) => {
  const { client } = await createConnectedMcpClient(input.serverId);

  try {
    const result = await client.callTool({
      name: input.toolName,
      arguments: input.arguments
    });

    return result;
  } finally {
    await client.close();
  }
};