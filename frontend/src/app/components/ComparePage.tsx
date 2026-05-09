import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Terminal, Sparkles } from "lucide-react";
import { api, ComparisonResult, PricingModel, formatUsd } from "../lib/api";

export function ComparePage() {
  const [cliCommand, setCliCommand] = useState("");
  const [mcpCommand, setMcpCommand] = useState("");
  const [modelId, setModelId] = useState("");
  const [models, setModels] = useState<PricingModel[]>([]);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoadingModels(true);
        const pricingModels = await api.getPricing();
        setModels(pricingModels);
        if (pricingModels.length > 0) {
          setModelId(pricingModels[0].modelId);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load pricing models."
        );
      } finally {
        setIsLoadingModels(false);
      }
    };

    void loadModels();
  }, []);

  const handleCompare = async () => {
    if (!cliCommand.trim() || !mcpCommand.trim()) {
      setErrorMessage("Please provide both CLI and MCP commands.");
      return;
    }

    try {
      setIsComparing(true);
      setErrorMessage(null);
      const response = await api.createComparison({
        cliCommand: cliCommand.trim(),
        mcpCommand: mcpCommand.trim(),
        modelId: modelId || undefined,
      });
      setResult(response.comparison);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to compare workflows."
      );
      setResult(null);
    } finally {
      setIsComparing(false);
    }
  };

  const recommendationTone = useMemo(() => {
    if (!result) {
      return "text-white";
    }

    if (result.recommendation.recommendedOption === "CLI") {
      return "text-blue-400";
    }

    if (result.recommendation.recommendedOption === "MCP") {
      return "text-purple-400";
    }

    return "text-green-400";
  }, [result]);

  return (
    <div className="p-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2">Compare Workflows</h1>
        <p className="text-gray-500">Compare CLI commands and MCP tool calls to find the cheaper and more efficient option.</p>
      </div>

      {/* Input Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/5 to-blue-700/5 border-blue-500/20">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                CLI Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={cliCommand}
                onChange={(e) => setCliCommand(e.target.value)}
                placeholder="Paste CLI command…"
                className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-mono"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-700/5 border-purple-500/20">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                MCP Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={mcpCommand}
                onChange={(e) => setMcpCommand(e.target.value)}
                placeholder="Paste MCP tool call…"
                className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-mono"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="bg-white/[0.02] border-white/5 max-w-sm">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-sm text-gray-400">Model</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Select
            value={modelId}
            onValueChange={setModelId}
            disabled={isLoadingModels || models.length === 0}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.modelId} value={model.modelId}>
                  {model.modelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleCompare}
          disabled={isComparing || isLoadingModels}
          className="bg-green-500 hover:bg-green-600 text-black px-8"
        >
          {isComparing ? "Comparing..." : "Compare Workflows"}
        </Button>
      </div>

      {errorMessage && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-red-300 text-sm">{errorMessage}</CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-lg">Comparison Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-500">Workflow</TableHead>
                      <TableHead className="text-gray-500">Input Tokens</TableHead>
                      <TableHead className="text-gray-500">Output Tokens</TableHead>
                      <TableHead className="text-gray-500">Total Tokens</TableHead>
                      <TableHead className="text-gray-500">Cost</TableHead>
                      <TableHead className="text-gray-500">Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        CLI
                      </TableCell>
                      <TableCell className="text-white">{result.cli.estimatedCost.inputTokens.toLocaleString()}</TableCell>
                      <TableCell className="text-white">{result.cli.estimatedCost.outputTokens.toLocaleString()}</TableCell>
                      <TableCell className="text-white">{result.cli.estimatedTokens.toLocaleString()}</TableCell>
                      <TableCell className="text-green-400">{formatUsd(result.cli.estimatedCost.totalCost)}</TableCell>
                      <TableCell className="text-green-400">{result.recommendation.recommendedOption === "CLI" ? "Best" : "-"}</TableCell>
                    </TableRow>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        MCP
                      </TableCell>
                      <TableCell className="text-white">{result.mcp.estimatedCost.inputTokens.toLocaleString()}</TableCell>
                      <TableCell className="text-white">{result.mcp.estimatedCost.outputTokens.toLocaleString()}</TableCell>
                      <TableCell className="text-white">{result.mcp.estimatedTokens.toLocaleString()}</TableCell>
                      <TableCell className="text-purple-400">{formatUsd(result.mcp.estimatedCost.totalCost)}</TableCell>
                      <TableCell className="text-white">{result.recommendation.recommendedOption === "MCP" ? "Best" : "-"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Best Option</CardTitle>
                  <Badge className="bg-green-500 text-black">
                    Recommended: {result.recommendation.recommendedOption}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`mb-6 ${recommendationTone}`}>
                  {result.recommendation.reason}
                </p>

                {/* Cost Comparison Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-blue-400">CLI</span>
                      <span className="text-white">{formatUsd(result.cli.estimatedCost.totalCost)}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                        style={{
                          width: `${
                            result.mcp.estimatedCost.totalCost === 0
                              ? 100
                              : (result.cli.estimatedCost.totalCost /
                                  result.mcp.estimatedCost.totalCost) *
                                100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-purple-400">MCP</span>
                      <span className="text-white">{formatUsd(result.mcp.estimatedCost.totalCost)}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 w-[100%] rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
