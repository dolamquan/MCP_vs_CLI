import { Request, Response } from "express";
import {
  getAllPricingConfigs,
  getPricingByModelId
} from "../services/pricing.service";

export const getAllPricing = (req: Request, res: Response) => {
    try {
        const pricingConfigs = getAllPricingConfigs();
        return res.status(200).json({
            success: true,
            data: pricingConfigs
        });
    } catch (error) {
        console.error("Error fetching pricing configs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pricing configurations."
        });
    }
};

export const getPricingById = (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;

    const pricing = getPricingByModelId(modelId);

    return res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error("Error fetching pricing config:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get pricing config."
    });
  }
};