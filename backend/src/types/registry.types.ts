import { McpServerConfig } from "./mcp.types";

export interface McpRegistryFile {
  servers: McpServerConfig[];
}

export interface CliRules {
  allowedCommands: string[];
  blockedCommands: string[];
  blockedPatterns: string[];
  maxCommandLength: number;
  executionTimeoutMs: number;
}

export interface CliProfile {
  id: string;
  name: string;
  description?: string;
  category?: string;
  commandTemplate: string;
  variables: string[];
}

export interface CliProfilesFile {
  profiles: CliProfile[];
}