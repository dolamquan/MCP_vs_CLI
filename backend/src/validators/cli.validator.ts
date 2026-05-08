import { Request, Response, NextFunction } from "express";

export const validateCliRunInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { command, mode } = req.body;

  if (!command || typeof command !== "string") {
    return res.status(400).json({
      success: false,
      message: "command is required and must be a string."
    });
  }

  if (command.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "command cannot be empty."
    });
  }

  if (!mode || typeof mode !== "string") {
    return res.status(400).json({
      success: false,
      message: "mode is required and must be either manual or sandbox."
    });
  }

  if (mode !== "manual" && mode !== "sandbox") {
    return res.status(400).json({
      success: false,
      message: "mode must be either manual or sandbox."
    });
  }

  next();
};