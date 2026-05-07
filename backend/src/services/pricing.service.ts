import {
  DEFAULT_MODEL_ID,
  MODEL_PRICING_CONFIG
} from "../config/pricing.config";
import { PricingConfig } from "../types/pricing.types";

export const getAllPricingConfigs = (): PricingConfig[] => {
  return MODEL_PRICING_CONFIG;
};

export const getPricingByModelId = (
  modelId: string = DEFAULT_MODEL_ID
): PricingConfig => {
  const pricing = MODEL_PRICING_CONFIG.find(
    (model) => model.modelId === modelId
  );

  if (!pricing) {
    const defaultPricing = MODEL_PRICING_CONFIG.find(
      (model) => model.modelId === DEFAULT_MODEL_ID
    );

    if (!defaultPricing) {
      throw new Error("Default pricing model is not configured.");
    }

    return defaultPricing;
  }

  return pricing;
};

export const isValidModelId = (modelId: string): boolean => {
  return MODEL_PRICING_CONFIG.some((model) => model.modelId === modelId);
};