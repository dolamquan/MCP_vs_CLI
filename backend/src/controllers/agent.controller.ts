import { Request, Response } from "express";
import {
  getAgentCapabilitiesContext,
  getAgentHealthContext
} from "../services/agentContext.service";
import { recommendAgentAction } from "../services/agentDecision.service";

const validateAgentRecommendBody = (body: any): string | null => {
  if (!body || typeof body !== "object") {
    return "Request body is required.";
  }

  if (!body.task || typeof body.task !== "string") {
    return "task is required and must be a string.";
  }

  if (!body.modelId || typeof body.modelId !== "string") {
    return "modelId is required and must be a string.";
  }

  if (!Array.isArray(body.candidateActions)) {
    return "candidateActions is required and must be an array.";
  }

  if (body.candidateActions.length === 0) {
    return "candidateActions must contain at least one action.";
  }

  for (const action of body.candidateActions) {
    if (!action.id || typeof action.id !== "string") {
      return "Each candidate action must have a string id.";
    }

    if (action.type !== "cli" && action.type !== "mcp") {
      return "Each candidate action type must be either cli or mcp.";
    }

    if (action.type === "cli") {
      if (!action.command || typeof action.command !== "string") {
        return "CLI candidate action requires command.";
      }

      if (action.mode !== "manual" && action.mode !== "sandbox") {
        return "CLI candidate action mode must be manual or sandbox.";
      }
    }

    if (action.type === "mcp") {
      if (!action.serverId || typeof action.serverId !== "string") {
        return "MCP candidate action requires serverId.";
      }

      if (!action.toolName || typeof action.toolName !== "string") {
        return "MCP candidate action requires toolName.";
      }

      if (
        !action.arguments ||
        typeof action.arguments !== "object" ||
        Array.isArray(action.arguments)
      ) {
        return "MCP candidate action requires arguments object.";
      }
    }
  }

  return null;
};

export const getAgentHealth = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: getAgentHealthContext()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get agent health."
    });
  }
};

export const getAgentCapabilities = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: getAgentCapabilitiesContext()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get agent capabilities."
    });
  }
};

export const recommendActionForAgent = async (
  req: Request,
  res: Response
) => {
  try {
    const validationError = validateAgentRecommendBody(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const result = await recommendAgentAction(req.body);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to recommend agent action."
    });
  }
};