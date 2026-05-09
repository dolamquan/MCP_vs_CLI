import path from "path";
import { McpServerConfig } from "../types/mcp.types";
import { McpRegistryFile } from "../types/registry.types";
import { readJsonFile, writeJsonFile } from "./jsonFile.service";

const MCP_REGISTRY_PATH =
  process.env.MCP_REGISTRY_PATH ||
  path.join(process.cwd(), "config", "mcp-servers.json");

const fallbackRegistry: McpRegistryFile = {
  servers: []
};

const resolvePlaceholder = (value: string): string => {
  if (value === "{{cwd}}") {
    return process.cwd();
  }

  const envMatch = value.match(/^\{\{env\.([A-Z0-9_]+)\}\}$/i);

  if (envMatch) {
    return process.env[envMatch[1]] || "";
  }

  return value;
};

const resolveServerConfig = (server: McpServerConfig): McpServerConfig => {
  if (server.transport === "stdio") {
    return {
      ...server,
      args: server.args.map(resolvePlaceholder),
      env: server.env
        ? Object.fromEntries(
            Object.entries(server.env).map(([key, value]) => [
              key,
              resolvePlaceholder(value ?? "")
            ])
          )
        : undefined
    };
  }

  return server;
};

export const getMcpRegistry = (): McpRegistryFile => {
  return readJsonFile<McpRegistryFile>(MCP_REGISTRY_PATH, fallbackRegistry);
};

export const saveMcpRegistry = (registry: McpRegistryFile): McpRegistryFile => {
  return writeJsonFile<McpRegistryFile>(MCP_REGISTRY_PATH, registry);
};

export const listMcpServerConfigs = (): McpServerConfig[] => {
  return getMcpRegistry().servers;
};

export const listResolvedMcpServerConfigs = (): McpServerConfig[] => {
  return getMcpRegistry().servers.map(resolveServerConfig);
};

export const listEnabledResolvedMcpServers = (): McpServerConfig[] => {
  return listResolvedMcpServerConfigs().filter((server) => server.enabled);
};

export const getResolvedMcpServerById = (
  serverId: string
): McpServerConfig | undefined => {
  return listEnabledResolvedMcpServers().find(
    (server) => server.serverId === serverId
  );
};

export const addMcpServerConfig = (
  server: McpServerConfig
): McpServerConfig => {
  const registry = getMcpRegistry();

  const exists = registry.servers.some(
    (item) => item.serverId === server.serverId
  );

  if (exists) {
    throw new Error(`MCP server already exists: ${server.serverId}`);
  }

  registry.servers.push(server);
  saveMcpRegistry(registry);

  return server;
};

export const updateMcpServerConfig = (
  serverId: string,
  updates: Partial<McpServerConfig>
): McpServerConfig => {
  const registry = getMcpRegistry();

  const index = registry.servers.findIndex(
    (server) => server.serverId === serverId
  );

  if (index === -1) {
    throw new Error(`MCP server not found: ${serverId}`);
  }

  const updatedServer = {
    ...registry.servers[index],
    ...updates,
    serverId
  } as McpServerConfig;

  registry.servers[index] = updatedServer;
  saveMcpRegistry(registry);

  return updatedServer;
};

export const deleteMcpServerConfig = (serverId: string): void => {
  const registry = getMcpRegistry();

  const nextServers = registry.servers.filter(
    (server) => server.serverId !== serverId
  );

  if (nextServers.length === registry.servers.length) {
    throw new Error(`MCP server not found: ${serverId}`);
  }

  saveMcpRegistry({
    servers: nextServers
  });
};
