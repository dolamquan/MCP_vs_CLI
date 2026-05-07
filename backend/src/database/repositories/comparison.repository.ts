import { prisma } from "../db";
import { ComparisonResult } from "../../types/comparison.types";

export const createComparisonRecord = async(
    result: ComparisonResult
) => {
    const record = await prisma.comparison.create({
        data:{
            cliCommand: result.cli.command,
            mcpCommand: result.mcp.command,
            cliTokens: result.cli.estimatedTokens,
            mcpTokens: result.mcp.estimatedTokens,
            tokenDifference: result.tokenDifference,
            cliInputCost: result.cli.estimatedCost.inputCost,
            cliOutputCost: result.cli.estimatedCost.outputCost,
            cliTotalCost: result.cli.estimatedCost.totalCost,
            mcpInputCost: result.mcp.estimatedCost.inputCost,
            mcpOutputCost: result.mcp.estimatedCost.outputCost,
            mcpTotalCost: result.mcp.estimatedCost.totalCost,
            costDifference: result.costDifference,
            amountSaved: result.savings.amountSaved,
            percentageSaved: result.savings.percentageSaved,
            recommendedOption: result.recommendation.recommendedOption,
            recommendationReason: result.recommendation.reason,
            modelId: result.modelId,
            modelName: result.modelName,
            createdAt: new Date(),
        }
    });
    return record;  
};

export const getComparisonHistoryRecords = async() => {
    const history = await prisma.comparison.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return history;
};

export const getComparisonRecordById = async (id: string) => {
  return prisma.comparison.findUnique({
    where: {
      id
    }
  });
};

export const deleteComparisonRecordById = async (id: string) => {
  return prisma.comparison.delete({
    where: {
      id
    }
  });
};