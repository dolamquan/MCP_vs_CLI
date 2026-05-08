import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

/**
 * StdioClientTransport: Used when MCP server runs as a local process
 * Communication happens through the standard input and output streams of the process.
 * syntax:
 * new StdioClientTransport({
 *  command: server.command, // The command to start the MCP server process (e.g., "node", "python", etc.)
 *  args: server.args, // An array of arguments to pass to the command (e.g., ["server.js"])
 *  env: cleanEnv(server.env) // An optional object containing environment variables to set for the process
 * })
 * */


/**
 * StreamableHTTPClientTransport: Used when MCP server is already running as an HTTP server and communication happens over a URl
 * Communication happens through HTTP requests and responses.
 * syntax:
 * new StreamableHTTPClientTransport({
 *  url: server.url, // The URL of the MCP server (e.g., "http://localhost:3000")
 * })
 * */


/**
 * new Client(...): creates an MCP client object -> this is the thing that our app uses to talk to an MCP server
 * const client = new Client(
 *  {
 *      name: MCP_CLIENT_NAME, // A string representing the name of the client (e.g., "MyMCPClient")
 *      version: MCP_CLIENT_VERSION // A string representing the version of the client (e.g., "1.0.0")
 *  },
 *  {
 *      capabilities: {} // An object representing the capabilities of the client (can be empty for now)
 *  }
 * 
 * )
 * 
 * 
 */


import {
    MCP_CLIENT_NAME,
    MCP_CLIENT_VERSION,
    getMcpServerById
} from "../config/mcp.config";


import { McpServerConfig } from "../types/mcp.types";

const cleanEnv = (
  env?: Record<string, string | undefined>
): Record<string, string> | undefined => {
  if (!env) {
    return undefined;
  }

  const cleaned: Record<string, string> = {};

  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string" && value.trim().length > 0) {
      cleaned[key] = value;
    }
  }

  return cleaned;
};

const createTransport = (server: McpServerConfig)=>{
    if(server.transport === "stdio"){
        return new StdioClientTransport({
            command: server.command,
            args: server.args,
            env: cleanEnv(server.env)
        });
    }

    return new StreamableHTTPClientTransport(new URL(server.url));
}


export const createConnectedMcpClient = async(serverId: string)=>{
    const server = getMcpServerById(serverId);
    if(!server){
        throw new Error(`MCP Server with id ${serverId} not found`);
    }

    const client = new Client(
        {
            name: MCP_CLIENT_NAME,
            version: MCP_CLIENT_VERSION
        },
        {
            capabilities: {}
        }
    );

    const transport = createTransport(server);
    await client.connect(transport);
    return {client, server};
};
