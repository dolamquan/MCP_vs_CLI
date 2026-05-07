import { Request, Response, NextFunction } from "express";
import { isValidModelId } from "../services/pricing.service";

export const validateComparisonInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cliCommand, mcpCommand, modelId } = req.body;

  if (!cliCommand || typeof cliCommand !== "string") {
    return res.status(400).json({
      success: false,
      message: "cliCommand is required and must be a string."
    });
  }

  if (!mcpCommand || typeof mcpCommand !== "string") {
    return res.status(400).json({
      success: false,
      message: "mcpCommand is required and must be a string."
    });
  }

  if (cliCommand.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "cliCommand cannot be empty."
    });
  }

  if (mcpCommand.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "mcpCommand cannot be empty."
    });
  }

  if (modelId !== undefined) {
    if (typeof modelId !== "string") {
      return res.status(400).json({
        success: false,
        message: "modelId must be a string."
      });
    }

    if (!isValidModelId(modelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid modelId."
      });
    }
  }

  next();
};