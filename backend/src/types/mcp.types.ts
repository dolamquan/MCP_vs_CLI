export type McpTransportType = "stdio" | "http"

export interface McpStdioServerConfig {
    serverId: string;
    serverName: string;
    transport: "stdio";
    command: string;
    args: string[];
    enabled: boolean;
    env?: Record<string, string | undefined>;
}

export interface McpHttpServerConfig {
    serverId: string;
    serverName: string;
    transport: "http";
    url: string;
    enabled: boolean;
}


export type McpServerConfig = McpStdioServerConfig | McpHttpServerConfig;

// Data needed to call a tool on the MCP server
export interface McpToolCallInput{
    serverId: string;
    toolName: string;
    arguments: Record<string, unknown>; 
}

export interface McpToolSummary{
    name: string;
    description?: string;
    inputSchema?: unknown; // Could be a JSON Schema or any other format defined by the server
}

export interface McpProfiledToolCallResult{
    serverId: string;
    serverName: string;
    transport: McpTransportType;
    toolName: string;
    arguments: Record<string, unknown>;
    requestTokens: number;
    resultTokens: number;
    totalTokens: number;
    result: unknown; // The actual result returned by the tool, could be any type depending on the tool
}