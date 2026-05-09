import { Request, Response } from "express";
import {
  addMcpServerConfig,
  deleteMcpServerConfig,
  listMcpServerConfigs,
  updateMcpServerConfig
} from "../services/mcpRegistry.service";
import {
  addCliProfile,
  deleteCliProfile,
  getCliRules,
  listCliProfiles,
  updateCliProfile,
  updateCliRules
} from "../services/cliRegistry.service";

export const getRegistryMcpServers = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: listMcpServerConfigs()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load MCP registry."
    });
  }
};

export const createRegistryMcpServer = (req: Request, res: Response) => {
  try {
    const server = addMcpServerConfig(req.body);

    return res.status(201).json({
      success: true,
      data: server
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add MCP server."
    });
  }
};

export const patchRegistryMcpServer = (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const server = updateMcpServerConfig(serverId, req.body);

    return res.status(200).json({
      success: true,
      data: server
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update MCP server."
    });
  }
};

export const removeRegistryMcpServer = (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    deleteMcpServerConfig(serverId);

    return res.status(200).json({
      success: true,
      message: "MCP server deleted."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete MCP server."
    });
  }
};

export const getRegistryCliRules = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: getCliRules()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load CLI rules."
    });
  }
};

export const patchRegistryCliRules = (req: Request, res: Response) => {
  try {
    const rules = updateCliRules(req.body);

    return res.status(200).json({
      success: true,
      data: rules
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update CLI rules."
    });
  }
};

export const getRegistryCliProfiles = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      data: listCliProfiles()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load CLI profiles."
    });
  }
};

export const createRegistryCliProfile = (req: Request, res: Response) => {
  try {
    const profile = addCliProfile(req.body);

    return res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add CLI profile."
    });
  }
};

export const patchRegistryCliProfile = (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const profile = updateCliProfile(profileId, req.body);

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update CLI profile."
    });
  }
};

export const removeRegistryCliProfile = (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;

    deleteCliProfile(profileId);

    return res.status(200).json({
      success: true,
      message: "CLI profile deleted."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete CLI profile."
    });
  }
};
