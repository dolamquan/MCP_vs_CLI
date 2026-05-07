import { countTokens } from "./tokenCounter.service";
import { estimateCost } from "./costEstimator.service";
import { getRecommendation } from "./recommendation.service";
import { calculateSavings } from "../utils/calculateSavings";
import {
  CommandInput,
  ComparisonResult
} from "../types/comparison.types";

export const compareCommands = (
  input: CommandInput
): ComparisonResult => {
    const { cliCommand, mcpCommand, modelId } = input;

    const cliTokens = countTokens(cliCommand);
    const mcpTokens = countTokens(mcpCommand);

    const cliCost = estimateCost(cliTokens, 0, modelId);
    const mcpCost = estimateCost(mcpTokens, 0, modelId);

    const tokenDifference = Math.abs(cliTokens - mcpTokens);
    const costDifference = Math.abs(cliCost.totalCost - mcpCost.totalCost);

    const higherCost = Math.max(cliCost.totalCost, mcpCost.totalCost);
    const lowerCost = Math.min(cliCost.totalCost, mcpCost.totalCost);

    const savings = calculateSavings(higherCost, lowerCost);

    const recommendation = getRecommendation({
        clitokens: cliTokens,
        mcptokens: mcpTokens,
        cliCost: cliCost.totalCost,
        mcpCost: mcpCost.totalCost
    });

    return {
        modelId: cliCost.modelId,
        modelName: cliCost.modelName,
        cli: {
        command: cliCommand,
        estimatedTokens: cliTokens,
        estimatedCost: cliCost
        },
        mcp: {
        command: mcpCommand,
        estimatedTokens: mcpTokens,
        estimatedCost: mcpCost
        },
        tokenDifference,
        costDifference,
        savings,
        recommendation
    };
};