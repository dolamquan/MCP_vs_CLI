import { Request, Response } from "express";
import {
  listMcpServers,
  listMcpTools
} from "../services/mcpTool.service";
import { profileMcpToolCall } from "../services/mcpProfiler.service";

export const getMcpServers = (req: Request, res: Response) => {
  try {
    const servers = listMcpServers();

    return res.status(200).json({
      success: true,
      data: servers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get MCP servers."
    });
  }
};

export const getMcpTools = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const tools = await listMcpTools(serverId);

    return res.status(200).json({
      success: true,
      data: tools
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get MCP tools."
    });
  }
};

export const runMcpTool = async (req: Request, res: Response) => {
  try {
    const { serverId, toolName, arguments: toolArguments } = req.body;

    const result = await profileMcpToolCall({
      serverId,
      toolName,
      arguments: toolArguments
    });

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
          : "Failed to run MCP tool."
    });
  }
};