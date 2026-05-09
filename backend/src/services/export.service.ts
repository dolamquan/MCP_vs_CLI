import { getComparisonHistoryRecords } from "../database/repositories/comparison.repository";
import { buildCsv } from "../utils/csvBuilder";
import { buildJsonExport } from "../utils/jsonExporter";

const mapHistoryForExport = (history: Awaited<ReturnType<typeof getComparisonHistoryRecords>>) => {
  return history.map((item) => {
    return {
      id: item.id,
      cliCommand: item.cliCommand,
      mcpCommand: item.mcpCommand,

      cliTokens: item.cliTokens,
      mcpTokens: item.mcpTokens,
      tokenDifference: item.tokenDifference,

      cliTotalCost: item.cliTotalCost,
      mcpTotalCost: item.mcpTotalCost,
      costDifference: item.costDifference,

      amountSaved: item.amountSaved,
      percentageSaved: item.percentageSaved,

      recommendedOption: item.recommendedOption,
      recommendationReason: item.recommendationReason,

      modelId: item.modelId,
      modelName: item.modelName,

      createdAt: item.createdAt
    };
  });
};

export const exportHistoryAsJson = async (): Promise<string> => {
  const history = await getComparisonHistoryRecords();
  const exportData = mapHistoryForExport(history);

  return buildJsonExport(exportData);
};

export const exportHistoryAsCsv = async (): Promise<string> => {
  const history = await getComparisonHistoryRecords();
  const exportData = mapHistoryForExport(history);

  return buildCsv(exportData);
};