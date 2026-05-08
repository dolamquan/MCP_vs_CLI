import { McpServerConfig } from "../types/mcp.types";

export const MCP_SERVERS: McpServerConfig[] = [
  {
    serverId: "filesystem-local",
    serverName: "Local Filesystem MCP",
    transport: "stdio",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      process.cwd()
    ],
    enabled: true // Enable the local filesystem MCP by default since it's generally safe and useful for development
  },

  {
    serverId: "git-local",
    serverName: "Local Git MCP",
    transport: "stdio",
    command: "uvx",
    args: [
      "mcp-server-git",
      "--repository",
      process.env.GIT_REPOSITORY_PATH || process.cwd()
    ],
    enabled: true
  },

  {
    serverId: "github",
    serverName: "GitHub MCP",
    transport: "stdio",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-github"
    ],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    },
    enabled: true
  },

  {
    serverId: "fetch",
    serverName: "Fetch MCP",
    transport: "stdio",
    command: "uvx",
    args: [
      "mcp-server-fetch"
    ],
    enabled: true
  },

  {
    serverId: "postgres",
    serverName: "PostgreSQL MCP",
    transport: "stdio",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-postgres",
      process.env.POSTGRES_CONNECTION_STRING || "postgresql://localhost/mydb"
    ],
    enabled: true
  },

  {
    serverId: "sqlite",
    serverName: "SQLite MCP",
    transport: "stdio",
    command: "npx",
    args: [
      "-y",
      "@berthojoris/mcp-sqlite-server",
      process.env.SQLITE_DATABASE_PATH ||"C:\\Users\\jackd\\OneDrive\\Documents\\Projects\\MCP - Server\\CLI_vs_MCP\\backend\\prisma\\dev.db",
    ],
    enabled: true
  },

  {
    serverId: "playwright",
    serverName: "Playwright MCP",
    transport: "stdio",
    command: "npx",
    args: [
      "@playwright/mcp@latest",
      "--headless"
    ],
    enabled: true
  },

  {
    serverId: "memory",
    serverName: "Memory MCP",
    transport: "stdio",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-memory"
    ],
    enabled: true
  },

  {
    serverId: "sequential-thinking",
    serverName: "Sequential Thinking MCP",
    transport: "stdio",
    command: "npx",
    args: [
      "-y",
      "@modelcontextprotocol/server-sequential-thinking"
    ],
    enabled: true
  },

  {
    serverId: "local-http",
    serverName: "Local HTTP MCP Server",
    transport: "http",
    url: "http://localhost:7000/mcp",
    enabled: true
  }
];

export const MCP_CLIENT_NAME = "cli-vs-mcp-token-advisor";

export const MCP_CLIENT_VERSION = "1.0.0";

export const getEnabledMcpServers = () => {
  return MCP_SERVERS.filter((server) => server.enabled);
};

export const getMcpServerById = (serverId: string) => {
  return MCP_SERVERS.find(
    (server) => server.serverId === serverId && server.enabled
  );
};
