import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAdvisorTools } from "./mcp-tools/advisor.tools";

const server = new McpServer({
    name: "cli-vs-mcp-token-advisor",
    version: "0.1.0",
    description: "An MCP server that profiles and compares token usage between CLI commands and MCP tool calls to recommend the most cost-effective option.",
});

registerAdvisorTools(server);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error: unknown) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
});
