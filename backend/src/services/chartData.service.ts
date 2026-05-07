import { getAllComparisonRecordsForReports } from "../database/repositories/report.repository";

export const getChartData = async () => {
  const records = await getAllComparisonRecordsForReports();

  const tokenComparisonData = records.map((record, index) => ({
    label: `Comparison ${index + 1}`,
    cliTokens: record.cliTokens,
    mcpTokens: record.mcpTokens
  }));

  const costComparisonData = records.map((record, index) => ({
    label: `Comparison ${index + 1}`,
    cliCost: record.cliTotalCost,
    mcpCost: record.mcpTotalCost
  }));

  const savingsTrendData = records.map((record, index) => ({
    label: `Comparison ${index + 1}`,
    amountSaved: record.amountSaved,
    percentageSaved: record.percentageSaved
  }));

  const recommendationCounts = records.reduce(
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

  const recommendationBreakdownData = [
    {
      option: "CLI",
      count: recommendationCounts.CLI
    },
    {
      option: "MCP",
      count: recommendationCounts.MCP
    },
    {
      option: "Equal",
      count: recommendationCounts.Equal
    }
  ];

  const modelUsageMap = records.reduce((models, record) => {
    const key = `${record.modelId}::${record.modelName}`;
    const existingModel = models.get(key);

    if (existingModel) {
      existingModel.count += 1;
      return models;
    }

    models.set(key, {
      modelId: record.modelId,
      modelName: record.modelName,
      count: 1
    });

    return models;
  }, new Map<string, { modelId: string; modelName: string; count: number }>());

  return {
    tokenComparisonData,
    costComparisonData,
    savingsTrendData,
    recommendationBreakdownData,
    modelUsageData: Array.from(modelUsageMap.values())
  };
};
