import { Request, Response } from "express";
import { profileCliCommand } from "../services/cliProfiler.service";
import { profileMcpToolCall } from "../services/mcpProfiler.service";
import { transformToComparisonResult } from "../services/profilerTransformer.service";
import { getPricingByModelId } from "../services/pricing.service";
import { prisma } from "../database/db";
import { ProfileRequest, ComparisonProfileRequest } from "../types/profiler.types";

export const profileCli = async (req: Request, res: Response) => {
  try {
    const { command, modelId } = req.body as ProfileRequest;

    if (!command) {
      return res.status(400).json({
        success: false,
        message: "Command is required.",
      });
    }

    const pricing = getPricingByModelId(modelId);

    const result = await profileCliCommand({
      command,
      mode: "manual",
      modelId: pricing.modelId,
    });

    return res.status(200).json({
      success: true,
      data: {
        modelId: pricing.modelId,
        modelName: pricing.modelName,
        command: result.command,
        estimatedTokens: result.totalTokens,
        estimatedCost: {
          totalCost: result.cost.totalCost,
          inputCost: result.cost.inputCost,
          outputCost: result.cost.outputCost,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to profile CLI.",
    });
  }
};

export const profileMcp = async (req: Request, res: Response) => {
  try {
    const { command, modelId } = req.body as ProfileRequest;

    if (!command) {
      return res.status(400).json({
        success: false,
        message: "Command is required.",
      });
    }

    let mcpPayload;
    try {
      mcpPayload = typeof command === "string" ? JSON.parse(command) : command;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid MCP command format. Must be valid JSON.",
      });
    }

    const { serverId, toolName, arguments: args } = mcpPayload;

    if (!serverId || !toolName) {
      return res.status(400).json({
        success: false,
        message: "MCP command must include serverId and toolName.",
      });
    }

    const pricing = getPricingByModelId(modelId);

    const result = await profileMcpToolCall({
      serverId,
      toolName,
      arguments: args || {},
      modelId: pricing.modelId,
    });

    return res.status(200).json({
      success: true,
      data: {
        modelId: pricing.modelId,
        modelName: pricing.modelName,
        command: `${toolName}`,
        estimatedTokens: result.totalTokens,
        estimatedCost: {
          totalCost: result.cost.totalCost,
          inputCost: result.cost.inputCost,
          outputCost: result.cost.outputCost,
          inputTokens: result.requestTokens,
          outputTokens: result.resultTokens,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to profile MCP.",
    });
  }
};

export const compareProfiles = async (req: Request, res: Response) => {
  try {
    const { cliCommand, mcpCommand, modelId } = req.body as ComparisonProfileRequest;

    if (!cliCommand || !mcpCommand) {
      return res.status(400).json({
        success: false,
        message: "Both cliCommand and mcpCommand are required.",
      });
    }

    const pricing = getPricingByModelId(modelId);

    const cli = await profileCliCommand({
      command: cliCommand,
      mode: "manual",
      modelId: pricing.modelId,
    });

    let mcpPayload;
    try {
      mcpPayload = typeof mcpCommand === "string" ? JSON.parse(mcpCommand) : mcpCommand;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid MCP command format. Must be valid JSON.",
      });
    }

    const { serverId, toolName, arguments: args } = mcpPayload;

    if (!serverId || !toolName) {
      return res.status(400).json({
        success: false,
        message: "MCP command must include serverId and toolName.",
      });
    }

    const mcp = await profileMcpToolCall({
      serverId,
      toolName,
      arguments: args || {},
      modelId: pricing.modelId,
    });

    const result = transformToComparisonResult(cli, mcp, pricing.modelId, pricing.modelName);

    await prisma.comparison.create({
      data: {
        cliCommand: result.cli.command,
        mcpCommand: result.mcp.command,
        cliTokens: result.cli.estimatedTokens,
        mcpTokens: result.mcp.estimatedTokens,
        tokenDifference: result.tokenDifference,
        cliInputCost: result.cli.estimatedCost.inputCost,
        cliOutputCost: result.cli.estimatedCost.outputCost,
        cliTotalCost: result.cli.estimatedCost.totalCost,
        mcpInputCost: result.mcp.estimatedCost.inputCost,
        mcpOutputCost: result.mcp.estimatedCost.outputCost,
        mcpTotalCost: result.mcp.estimatedCost.totalCost,
        costDifference: result.costDifference,
        amountSaved: result.savings.amountSaved,
        percentageSaved: result.savings.percentageSaved,
        recommendedOption: result.recommendation.recommendedOption,
        recommendationReason: result.recommendation.reason,
        modelId: result.modelId,
        modelName: result.modelName,
        createdAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to compare profiles.",
    });
  }
};
