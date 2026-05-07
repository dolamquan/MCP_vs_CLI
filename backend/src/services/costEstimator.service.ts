import { CostEstimate } from "../types/pricing.types";
import { getPricingByModelId } from "./pricing.service";

export const estimateCost = (
    inputTokens: number,
    outputTokens: number = 0,
    modelId?: string
    ): CostEstimate => {
    const pricing = getPricingByModelId(modelId);

    const inputCost =
        (inputTokens / 1_000_000) * pricing.inputCostPer1MTokens;

    const outputCost =
        (outputTokens / 1_000_000) * pricing.outputCostPer1MTokens;

    const result: CostEstimate = {
        modelId: pricing.modelId,
        modelName: pricing.modelName,
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost
    };

    return result;
};