import {
  getAllComparisonRecordsForReports,
  getTotalComparisonCount
} from "../database/repositories/report.repository";

const createEmptySummary = () => ({
  totalComparisons: 0,
  totalCliTokens: 0,
  totalMcpTokens: 0,
  totalTokens: 0,
  totalCliCost: 0,
  totalMcpCost: 0,
  totalCost: 0,
  totalSavings: 0,
  averageCliTokens: 0,
  averageMcpTokens: 0,
  averageCostDifference: 0,
  mostRecommendedOption: "None",
  recommendationBreakdown: {
    CLI: 0,
    MCP: 0,
    Equal: 0
  }
});

export const getReportSummary = async () => {
  const [records, totalComparisons] = await Promise.all([
    getAllComparisonRecordsForReports(),
    getTotalComparisonCount()
  ]);

  if (totalComparisons === 0) {
    return createEmptySummary();
  }

  const recommendationBreakdown = records.reduce(
    (totals, record) => {
      const option =
        record.recommendedOption === "CLI" ||
        record.recommendedOption === "MCP" ||
        record.recommendedOption === "Equal"
          ? record.recommendedOption
          : "Equal";

      totals[option] += 1;
      return totals;
    },
    {
      CLI: 0,
      MCP: 0,
      Equal: 0
    }
  );

  const totalCliTokens = records.reduce((sum, record) => sum + record.cliTokens, 0);
  const totalMcpTokens = records.reduce((sum, record) => sum + record.mcpTokens, 0);
  const totalCliCost = records.reduce((sum, record) => sum + record.cliTotalCost, 0);
  const totalMcpCost = records.reduce((sum, record) => sum + record.mcpTotalCost, 0);
  const totalSavings = records.reduce((sum, record) => sum + record.amountSaved, 0);
  const totalCostDifference = records.reduce(
    (sum, record) => sum + record.costDifference,
    0
  );

  const mostRecommendedOption = (() => {
    const options = ["CLI", "MCP", "Equal"] as const;

    return options.reduce((currentBest, option) => {
      if (
        recommendationBreakdown[option] > recommendationBreakdown[currentBest]
      ) {
        return option;
      }

      return currentBest;
    }, "CLI");
  })();

  return {
    totalComparisons,
    totalCliTokens,
    totalMcpTokens,
    totalTokens: totalCliTokens + totalMcpTokens,
    totalCliCost,
    totalMcpCost,
    totalCost: totalCliCost + totalMcpCost,
    totalSavings,
    averageCliTokens: totalCliTokens / totalComparisons,
    averageMcpTokens: totalMcpTokens / totalComparisons,
    averageCostDifference: totalCostDifference / totalComparisons,
    mostRecommendedOption,
    recommendationBreakdown
  };
};
