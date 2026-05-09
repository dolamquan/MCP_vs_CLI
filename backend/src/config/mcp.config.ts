import {
  getResolvedMcpServerById,
  listEnabledResolvedMcpServers
} from "../services/mcpRegistry.service";

export const MCP_CLIENT_NAME = "cli-vs-mcp-token-advisor";

export const MCP_CLIENT_VERSION = "1.0.0";

export const getEnabledMcpServers = () => {
  return listEnabledResolvedMcpServers();
};

export const getMcpServerById = (serverId: string) => {
  return getResolvedMcpServerById(serverId);
};