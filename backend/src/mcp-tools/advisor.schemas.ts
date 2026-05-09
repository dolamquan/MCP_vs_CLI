import { z } from "zod";

export const AgentCliCandidateActionSchema = z.object({
  id: z.string(),
  type: z.literal("cli"),
  command: z.string(),
  mode: z.enum(["manual", "sandbox"]).default("sandbox")
});

export const AgentMcpCandidateActionSchema = z.object({
  id: z.string(),
  type: z.literal("mcp"),
  serverId: z.string(),
  toolName: z.string(),
  arguments: z.record(z.string(), z.unknown()).default({})
});

export const AgentCandidateActionSchema = z.discriminatedUnion("type", [
  AgentCliCandidateActionSchema,
  AgentMcpCandidateActionSchema
]);

export const RecommendActionSchema = z.object({
  task: z.string(),
  modelId: z.string().default("gpt-4.1-mini"),
  candidateActions: z.array(AgentCandidateActionSchema).min(1)
});

export const ProfileCliSchema = z.object({
  command: z.string(),
  mode: z.enum(["manual", "sandbox"]).default("sandbox"),
  modelId: z.string().default("gpt-4.1-mini")
});

export const ProfileMcpSchema = z.object({
  serverId: z.string(),
  toolName: z.string(),
  arguments: z.record(z.string(), z.unknown()).default({}),
  modelId: z.string().default("gpt-4.1-mini")
});

export const CompareCliMcpSchema = z.object({
  taskName: z.string().optional(),
  modelId: z.string().default("gpt-4.1-mini"),
  cliOption: z.object({
    command: z.string(),
    mode: z.enum(["manual", "sandbox"]).default("sandbox")
  }),
  mcpOption: z.object({
    serverId: z.string(),
    toolName: z.string(),
    arguments: z.record(z.string(), z.unknown()).default({})
  })
});