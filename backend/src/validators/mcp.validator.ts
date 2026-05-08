import { Request, Response, NextFunction } from "express";
import { getMcpServerById } from "../config/mcp.config";

export const validateMcpServerIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serverId } = req.params;

  if (!serverId || typeof serverId !== "string") {
    return res.status(400).json({
      success: false,
      message: "serverId is required."
    });
  }

  const server = getMcpServerById(serverId);

  if (!server) {
    return res.status(404).json({
      success: false,
      message: `MCP server "${serverId}" was not found or is disabled.`
    });
  }

  next();
};

export const validateMcpToolCallInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serverId, toolName, arguments: toolArguments } = req.body;

  if (!serverId || typeof serverId !== "string") {
    return res.status(400).json({
      success: false,
      message: "serverId is required and must be a string."
    });
  }

  if (!getMcpServerById(serverId)) {
    return res.status(404).json({
      success: false,
      message: `MCP server "${serverId}" was not found or is disabled.`
    });
  }

  if (!toolName || typeof toolName !== "string") {
    return res.status(400).json({
      success: false,
      message: "toolName is required and must be a string."
    });
  }

  if (
    !toolArguments ||
    typeof toolArguments !== "object" ||
    Array.isArray(toolArguments)
  ) {
    return res.status(400).json({
      success: false,
      message: "arguments is required and must be an object."
    });
  }

  next();
};