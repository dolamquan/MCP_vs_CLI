import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CompareCliMcpSchema,
  ProfileCliSchema,
  ProfileMcpSchema,
  RecommendActionSchema
} from "./advisor.schemas";
import { recommendAgentAction } from "../services/agentDecision.service";
import { profileCliCommand } from "../services/cliProfiler.service";
import { profileMcpToolCall } from "../services/mcpProfiler.service";
import { compareCliVsMcp } from "../services/decisionEngine.service";
import {
  getAgentCapabilitiesContext,
  getAgentHealthContext
} from "../services/agentContext.service";

const toMcpText = (data: unknown) => {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2)
      }
    ]
  };
};

export const registerAdvisorTools = (server: McpServer) => {
  server.tool(
    "advisor_health",
    "Check whether the CLI vs MCP token advisor is ready.",
    {},
    async () => {
      return toMcpText({
        success: true,
        data: getAgentHealthContext()
      });
    }
  );

  server.tool(
    "advisor_capabilities",
    "List advisor capabilities, enabled MCP servers, CLI rules, and useful endpoints.",
    {},
    async () => {
      return toMcpText({
        success: true,
        data: getAgentCapabilitiesContext()
      });
    }
  );

  server.tool(
    "advisor_recommend_action",
    "Given multiple CLI and MCP candidate actions, profile them and recommend the cheapest successful action by token usage.",
    RecommendActionSchema.shape,
    async (input) => {
      const result = await recommendAgentAction(input);

      return toMcpText({
        success: true,
        data: result
      });
    }
  );

  server.tool(
    "advisor_profile_cli",
    "Profile one CLI command by counting command tokens, output tokens, and estimated model cost.",
    ProfileCliSchema.shape,
    async (input) => {
      const result = await profileCliCommand(input);

      return toMcpText({
        success: true,
        data: result
      });
    }
  );

  server.tool(
    "advisor_profile_mcp",
    "Profile one MCP tool call by counting request tokens, result tokens, and estimated model cost.",
    ProfileMcpSchema.shape,
    async (input) => {
      const result = await profileMcpToolCall(input);

      return toMcpText({
        success: true,
        data: result
      });
    }
  );

  server.tool(
    "advisor_compare_cli_mcp",
    "Compare one CLI action against one MCP tool call and recommend the cheaper option.",
    CompareCliMcpSchema.shape,
    async (input) => {
      const result = await compareCliVsMcp(input);

      return toMcpText({
        success: true,
        data: result
      });
    }
  );
};