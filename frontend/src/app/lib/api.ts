const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

type ApiErrorResponse = {
  success: false;
  message?: string;
};

export type PricingModel = {
  modelId: string;
  modelName: string;
  provider: string;
  inputCostPer1MTokens: number;
  outputCostPer1MTokens: number;
};

export type AppSettings = {
  defaultModelId: string;
  defaultExportFormat: "json" | "csv";
  saveHistory: boolean;
  enableCliExecution: boolean;
  enableMCPExecution: boolean;
  maxHistoryItems: number;
};

type AppSettingsResponse = {
  defaultModelId: string;
  defaultExportFormat: "json" | "csv";
  saveHistory: boolean;
  enableCliExecution: boolean;
  enableMCPExecution: boolean;
  MaxHistoryItems?: number;
  maxHistoryItems?: number;
};

export type ComparisonRecord = {
  id: string;
  cliCommand: string;
  mcpCommand: string;
  cliTokens: number;
  mcpTokens: number;
  tokenDifference: number;
  cliInputCost: number;
  cliOutputCost: number;
  cliTotalCost: number;
  mcpInputCost: number;
  mcpOutputCost: number;
  mcpTotalCost: number;
  costDifference: number;
  amountSaved: number;
  percentageSaved: number;
  recommendedOption: "CLI" | "MCP" | "Equal" | string;
  recommendationReason: string;
  modelId: string;
  modelName: string;
  createdAt: string;
};

export type ComparisonResult = {
  modelId: string;
  modelName: string;
  cli: {
    command: string;
    estimatedTokens: number;
    estimatedCost: {
      totalCost: number;
      inputCost: number;
      outputCost: number;
      inputTokens: number;
      outputTokens: number;
    };
  };
  mcp: {
    command: string;
    estimatedTokens: number;
    estimatedCost: {
      totalCost: number;
      inputCost: number;
      outputCost: number;
      inputTokens: number;
      outputTokens: number;
    };
  };
  tokenDifference: number;
  costDifference: number;
  savings: {
    amountSaved: number;
    percentageSaved: number;
  };
  recommendation: {
    recommendedOption: "CLI" | "MCP" | "Equal";
    reason: string;
  };
};

export type SummaryReport = {
  totalComparisons: number;
  totalCliTokens: number;
  totalMcpTokens: number;
  totalTokens: number;
  totalCliCost: number;
  totalMcpCost: number;
  totalCost: number;
  totalSavings: number;
  averageCliTokens: number;
  averageMcpTokens: number;
  averageCostDifference: number;
  mostRecommendedOption: string;
  recommendationBreakdown: {
    CLI: number;
    MCP: number;
    Equal: number;
  };
};

export type ChartDataResponse = {
  tokenComparisonData: Array<{
    label: string;
    cliTokens: number;
    mcpTokens: number;
  }>;
  costComparisonData: Array<{
    label: string;
    cliCost: number;
    mcpCost: number;
  }>;
  savingsTrendData: Array<{
    label: string;
    amountSaved: number;
    percentageSaved: number;
  }>;
  recommendationBreakdownData: Array<{
    option: "CLI" | "MCP" | "Equal";
    count: number;
  }>;
  modelUsageData: Array<{
    modelId: string;
    modelName: string;
    count: number;
  }>;
};

const getErrorMessage = (status: number, body: unknown): string => {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return `Request failed with status ${status}.`;
};

const parseJsonSafely = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(response.status, body));
  }

  const parsedBody = body as ApiSuccessResponse<T> | ApiErrorResponse | null;

  if (!parsedBody || parsedBody.success !== true) {
    throw new Error("Unexpected API response format.");
  }

  return parsedBody.data;
};

export const api = {
  getPricing: () => request<PricingModel[]>("/pricing"),

  getSummaryReport: () => request<SummaryReport>("/reports/summary"),

  getReportChartData: () => request<ChartDataResponse>("/reports/chart-data"),

  getHistory: () => request<ComparisonRecord[]>("/history"),

  deleteHistoryById: (id: string) =>
    request<{ message?: string }>(`/history/${id}`, {
      method: "DELETE",
    }),

  createComparison: (payload: {
    cliCommand: string;
    mcpCommand: string;
    modelId?: string;
  }) =>
    request<{
      comparison: ComparisonResult;
      savedRecord: ComparisonRecord;
    }>("/comparisons", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSettings: async () => {
    const response = await request<AppSettingsResponse>("/settings");

    return {
      defaultModelId: response.defaultModelId,
      defaultExportFormat: response.defaultExportFormat,
      saveHistory: response.saveHistory,
      enableCliExecution: response.enableCliExecution,
      enableMCPExecution: response.enableMCPExecution,
      maxHistoryItems:
        response.maxHistoryItems ?? response.MaxHistoryItems ?? 100,
    } satisfies AppSettings;
  },

  updateSettings: async (payload: Partial<AppSettings>) => {
    const response = await request<AppSettingsResponse>("/settings", {
      method: "PATCH",
      body: JSON.stringify({
        ...payload,
        MaxHistoryItems: payload.maxHistoryItems,
      }),
    });

    return {
      defaultModelId: response.defaultModelId,
      defaultExportFormat: response.defaultExportFormat,
      saveHistory: response.saveHistory,
      enableCliExecution: response.enableCliExecution,
      enableMCPExecution: response.enableMCPExecution,
      maxHistoryItems:
        response.maxHistoryItems ?? response.MaxHistoryItems ?? 100,
    } satisfies AppSettings;
  },

  getExportUrl: (format: "json" | "csv") =>
    `${API_BASE_URL}/export/history/${format}`,
};

export const formatUsd = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
};
