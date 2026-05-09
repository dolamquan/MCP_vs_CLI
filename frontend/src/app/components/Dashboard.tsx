import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Terminal, Activity, Plus, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api, ChartDataResponse, ComparisonRecord, SummaryReport, formatUsd } from "../lib/api";

const emptySummary: SummaryReport = {
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
    Equal: 0,
  },
};

const emptyChartData: ChartDataResponse = {
  tokenComparisonData: [],
  costComparisonData: [],
  savingsTrendData: [],
  recommendationBreakdownData: [],
  modelUsageData: [],
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("today");
  const [summary, setSummary] = useState<SummaryReport>(emptySummary);
  const [chartData, setChartData] = useState<ChartDataResponse>(emptyChartData);
  const [recentHistory, setRecentHistory] = useState<ComparisonRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setErrorMessage(null);
        const [summaryData, reportChartData, historyData] = await Promise.all([
          api.getSummaryReport(),
          api.getReportChartData(),
          api.getHistory(),
        ]);

        setSummary(summaryData);
        setChartData(reportChartData);
        setRecentHistory(historyData.slice(0, 3));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load dashboard data."
        );
      }
    };

    void loadDashboard();
  }, []);

  const trendPoints = useMemo(() => {
    return chartData.tokenComparisonData.map((entry, index) => ({
      name: `Run ${index + 1}`,
      value: entry.cliTokens + entry.mcpTokens,
    }));
  }, [chartData.tokenComparisonData]);

  return (
    <div className="max-w-7xl mx-auto p-12 space-y-12">
      {/* Main Balance Card - Large & Minimal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-3">
          <h2 className="text-sm text-gray-500">Total Token Usage</h2>
          <div className="text-7xl tracking-tight">{summary.totalTokens.toLocaleString()}</div>
          <div className="flex gap-12 pt-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">CLI Tokens</div>
              <div className="text-2xl">{summary.totalCliTokens.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">MCP Tokens</div>
              <div className="text-2xl">{summary.totalMcpTokens.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Total Cost</div>
              <div className="text-2xl text-green-400">{formatUsd(summary.totalCost)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {errorMessage && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-red-300 text-sm">{errorMessage}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Analysis Card - Minimal */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Analysis</CardTitle>
                <Button
                  size="sm"
                  className="bg-white/5 hover:bg-white/10 border-0 h-9 px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {recentHistory.length === 0 && (
                  <div className="text-sm text-gray-500">No analysis history yet.</div>
                )}

                {recentHistory.map((record, index) => {
                  const isCliBest = record.recommendedOption === "CLI";
                  const bestCost = Math.min(record.cliTotalCost, record.mcpTotalCost);

                  return (
                    <div
                      key={record.id}
                      className={`flex items-start justify-between ${
                        index < recentHistory.length - 1
                          ? "pb-8 border-b border-white/5"
                          : ""
                      }`}
                    >
                      <div className="flex gap-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isCliBest ? "bg-blue-500/10" : "bg-purple-500/10"
                          }`}
                        >
                          {isCliBest ? (
                            <Terminal className="w-5 h-5 text-blue-400" />
                          ) : (
                            <Activity className="w-5 h-5 text-purple-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm mb-1">
                            {isCliBest ? "CLI Command" : "MCP Command"}
                          </div>
                          <code className="text-xs text-gray-500 block truncate">
                            {isCliBest ? record.cliCommand : record.mcpCommand}
                          </code>
                          <div className="text-xs text-gray-600 mt-2">
                            {isCliBest
                              ? record.cliTokens.toLocaleString()
                              : record.mcpTokens.toLocaleString()} tokens
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg mb-1">{formatUsd(bestCost)}</div>
                        <div className="text-xs text-green-400 flex items-center justify-end gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {record.percentageSaved.toFixed(1)}% saved
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Stats Card - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg">Usage Stats</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="bg-white/5 p-1">
                  <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
                  <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs text-gray-500">All comparisons</span>
                    <span className="text-xs text-green-400">Total saved {formatUsd(summary.totalSavings)} ↗</span>
                  </div>
                  <div className="text-5xl mb-8">{formatUsd(summary.totalCost)}</div>
                </div>

                {/* Simple Bar Chart */}
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-2">CLI {formatUsd(summary.totalCliCost)}</div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                        style={{
                          width: `${
                            summary.totalCost === 0
                              ? 0
                              : (summary.totalCliCost / summary.totalCost) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">MCP {formatUsd(summary.totalMcpCost)}</div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"
                        style={{
                          width: `${
                            summary.totalCost === 0
                              ? 0
                              : (summary.totalMcpCost / summary.totalCost) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Average difference {formatUsd(summary.averageCostDifference)}</div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-[50%] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500" />
                      <span className="text-gray-400">CLI</span>
                    </div>
                    <span>{summary.recommendationBreakdown.CLI}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-gray-400">MCP</span>
                    </div>
                    <span>{summary.recommendationBreakdown.MCP}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-gray-400">Other</span>
                    </div>
                    <span>{summary.recommendationBreakdown.Equal}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Statistics Chart - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
          <CardHeader className="border-b border-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Token Trends</CardTitle>
              <Select defaultValue="6months">
                <SelectTrigger className="w-40 bg-white/5 border-white/10 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last month</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendPoints}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ffffff10' }}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ffffff10' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
