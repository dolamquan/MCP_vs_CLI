import { Request, Response, NextFunction } from "express";
import { isValidModelId } from "../services/pricing.service";

export const validateModelIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { modelId } = req.params;

    if (!modelId || typeof modelId !== "string") {
        return res.status(400).json({
            success: false,
            message: "modelId is required."
        });
    }

    if (!isValidModelId(modelId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid modelId."
        });
    }

    next();
};