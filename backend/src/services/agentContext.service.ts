import { getEnabledMcpServers} from "../config/mcp.config";
import { listCliProfiles, getCliRules} from "./cliRegistry.service";

// Is the agent backend up and usable?
export const getAgentHealthContext = () => {
    const enabledMcpServers = getEnabledMcpServers();
    const cliProfiles = listCliProfiles();

    return {
        status: "ready",
        enabledMcpServers: enabledMcpServers.length,
        cliProfiles: cliProfiles.length,
        version: "0.1.0",
    };
};

// Describe the agent's capabilities, such as supported action types, available MCP servers and tools, CLI rules, etc.
export const getAgentCapabilitiesContext = () => {
    const cliRules = getCliRules();
    const enabledMcpServers = getEnabledMcpServers();

    return {
        supportsCliProfiling: true,
        supportsMcpProfiling: true,
        supportsComparison: true,
        supportsMultiActionRecommendation: true,
        supportsDynamicMcpRegistry: true,
        supportsDynamicCliRules: true,
        enabledMcpServers: enabledMcpServers.map((server) => {
        return {
            serverId: server.serverId,
            serverName: server.serverName,
            transport: server.transport,
            enabled: server.enabled
        };
        }),
        cliRules: {
        allowedCommands: cliRules.allowedCommands,
        blockedCommands: cliRules.blockedCommands,
        maxCommandLength: cliRules.maxCommandLength,
        executionTimeoutMs: cliRules.executionTimeoutMs
        },
        endpoints: {
        health: "/api/agent/health",
        capabilities: "/api/agent/capabilities",
        recommend: "/api/agent/recommend",
        profileCli: "/api/profiler/cli",
        profileMcp: "/api/profiler/mcp",
        compare: "/api/profiler/compare",
        mcpServers: "/api/mcp/servers",
        mcpTools: "/api/mcp/servers/:serverId/tools"
        }
    };
};

