import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Terminal, Sparkles, Copy, Trash2, Download } from "lucide-react";
import { api, ComparisonRecord, formatUsd } from "../lib/api";

export function HistoryPage() {
  const [historyData, setHistoryData] = useState<ComparisonRecord[]>([]);
  const [searchText, setSearchText] = useState("");
  const [workflowFilter, setWorkflowFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await api.getHistory();
      setHistoryData(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load history."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return historyData.filter((row) => {
      const matchesSearch =
        row.cliCommand.toLowerCase().includes(searchText.toLowerCase()) ||
        row.mcpCommand.toLowerCase().includes(searchText.toLowerCase()) ||
        row.modelName.toLowerCase().includes(searchText.toLowerCase());

      if (workflowFilter === "cli") {
        return matchesSearch && row.recommendedOption === "CLI";
      }

      if (workflowFilter === "mcp") {
        return matchesSearch && row.recommendedOption === "MCP";
      }

      return matchesSearch;
    });
  }, [historyData, searchText, workflowFilter]);

  const totalRuns = historyData.length;
  const averageCost =
    totalRuns === 0
      ? 0
      : historyData.reduce(
          (sum, row) => sum + Math.min(row.cliTotalCost, row.mcpTotalCost),
          0
        ) / totalRuns;
  const cliWins = historyData.filter(
    (row) => row.recommendedOption === "CLI"
  ).length;
  const mcpWins = historyData.filter(
    (row) => row.recommendedOption === "MCP"
  ).length;
  const mostEfficientType =
    cliWins === mcpWins ? "Equal" : cliWins > mcpWins ? "CLI" : "MCP";
  const totalSaved = historyData.reduce((sum, row) => sum + row.amountSaved, 0);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteHistoryById(id);
      setHistoryData((previous) => previous.filter((item) => item.id !== id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete history item."
      );
    }
  };

  const handleCopy = async (row: ComparisonRecord) => {
    const text = `CLI: ${row.cliCommand}\nMCP: ${row.mcpCommand}`;
    await navigator.clipboard.writeText(text);
  };

  const handleExport = (format: "json" | "csv") => {
    window.open(api.getExportUrl(format), "_blank", "noopener,noreferrer");
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2">Analysis History</h1>
        <p className="text-gray-500">Review previous CLI and MCP token usage results.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Runs", value: totalRuns.toString(), color: "text-white" },
          { label: "Average Cost", value: formatUsd(averageCost), color: "text-white" },
          {
            label: "Most Efficient Type",
            value: mostEfficientType,
            color: mostEfficientType === "MCP" ? "text-purple-400" : "text-blue-400",
          },
          { label: "Total Saved", value: formatUsd(totalSaved), color: "text-green-400" },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-gray-500">{metric.label}</CardTitle>
                <div className={`text-2xl ${metric.color}`}>{metric.value}</div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search command history…"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
              />
              <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workflows</SelectItem>
                  <SelectItem value="cli">CLI Only</SelectItem>
                  <SelectItem value="mcp">MCP Only</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-models">
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-models">All Models</SelectItem>
                  <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                  <SelectItem value="gpt-4.1-mini">GPT-4.1 Mini</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="7days">
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleExport("csv")}
                className="bg-white/5 hover:bg-white/10 border-0"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex gap-3">
        <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={() => handleExport("json")}>
          Export JSON
        </Button>
        <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={loadHistory}>
          Refresh
        </Button>
      </div>

      {errorMessage && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-red-300 text-sm">{errorMessage}</CardContent>
        </Card>
      )}

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg">Command History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-500">Date</TableHead>
                  <TableHead className="text-gray-500">Recommended</TableHead>
                  <TableHead className="text-gray-500">Command Preview</TableHead>
                  <TableHead className="text-gray-500">Model</TableHead>
                  <TableHead className="text-gray-500">CLI Tokens</TableHead>
                  <TableHead className="text-gray-500">MCP Tokens</TableHead>
                  <TableHead className="text-gray-500">Best Cost</TableHead>
                  <TableHead className="text-gray-500">Savings</TableHead>
                  <TableHead className="text-gray-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow className="border-white/10">
                    <TableCell className="text-gray-400 text-sm" colSpan={9}>
                      Loading history...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && filteredHistory.length === 0 && (
                  <TableRow className="border-white/10">
                    <TableCell className="text-gray-400 text-sm" colSpan={9}>
                      No comparison history found.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && filteredHistory.map((row) => (
                  <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-gray-400 text-sm">{formatDate(row.createdAt)}</TableCell>
                    <TableCell>
                      {row.recommendedOption === "CLI" ? (
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                          <Terminal className="w-3 h-3 mr-1" />
                          CLI
                        </Badge>
                      ) : row.recommendedOption === "MCP" ? (
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">
                          <Sparkles className="w-3 h-3 mr-1" />
                          MCP
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                          Equal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-white font-mono text-xs max-w-xs truncate">{row.cliCommand}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{row.modelName}</TableCell>
                    <TableCell className="text-white text-sm">{row.cliTokens.toLocaleString()}</TableCell>
                    <TableCell className="text-white text-sm">{row.mcpTokens.toLocaleString()}</TableCell>
                    <TableCell className="text-green-400 text-sm">{formatUsd(Math.min(row.cliTotalCost, row.mcpTotalCost))}</TableCell>
                    <TableCell className="text-green-400 text-sm">{row.percentageSaved.toFixed(2)}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          onClick={() => {
                            void handleCopy(row);
                          }}
                        >
                          <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          onClick={() => {
                            void handleDelete(row.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
