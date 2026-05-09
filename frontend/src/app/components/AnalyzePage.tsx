import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { api, ProfileResponse, PricingModel, formatUsd } from "../lib/api";

export function AnalyzePage() {
  const [workflowType, setWorkflowType] = useState("CLI");
  const [model, setModel] = useState("");
  const [command, setCommand] = useState("");
  const [models, setModels] = useState<PricingModel[]>([]);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const pricingModels = await api.getPricing();
        setModels(pricingModels);
        if (pricingModels.length > 0) {
          setModel(pricingModels[0].modelId);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load pricing models."
        );
      }
    };

    void loadModels();
  }, []);

  const analyzedResult = useMemo(() => {
    return profile;
  }, [profile]);

  const handleAnalyze = async () => {
    if (!command.trim()) {
      setErrorMessage("Please enter a command to analyze.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMessage(null);

      const result =
        workflowType === "CLI"
          ? await api.profileCli({
              command: command.trim(),
              modelId: model || undefined,
            })
          : await api.profileMcp({
              command: command.trim(),
              modelId: model || undefined,
            });

      setProfile(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to analyze workflow."
      );
      setProfile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setCommand("");
    setProfile(null);
    setErrorMessage(null);
  };

  return (
    <div className="p-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2">Analyze Workflow</h1>
        <p className="text-gray-500">Paste a command or tool call to estimate token usage, cost, and efficiency.</p>
      </div>

      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg">Workflow Input</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Workflow Type</label>
                <Select value={workflowType} onValueChange={setWorkflowType}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLI">CLI</SelectItem>
                    <SelectItem value="MCP">MCP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Model</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((item) => (
                      <SelectItem key={item.modelId} value={item.modelId}>
                        {item.modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Command</label>
              <Textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Paste your CLI command or MCP tool call here…"
                className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-mono"
              />
            </div>

            {errorMessage && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-green-500 hover:bg-green-600 text-black"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Workflow"}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {analyzedResult && profile && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: "Input Tokens",
                value: analyzedResult.estimatedCost.inputTokens.toLocaleString(),
                color: "text-white",
              },
              {
                label: "Output Tokens",
                value: analyzedResult.estimatedCost.outputTokens.toLocaleString(),
                color: "text-white",
              },
              {
                label: "Total Tokens",
                value: analyzedResult.estimatedTokens.toLocaleString(),
                color: "text-white",
              },
              {
                label: "Estimated Cost",
                value: formatUsd(analyzedResult.estimatedCost.totalCost),
                color: "text-green-400",
              },
              {
                label: "Model",
                value: profile.modelName,
                color: "text-blue-400",
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-white/[0.02] border-white/5 hover:border-green-500/30 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-500 text-xs">{metric.label}</CardDescription>
                    <CardTitle className={`text-3xl ${metric.color}`}>{metric.value}</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-green-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Profile Summary
                  <Badge className="bg-green-500 text-black">{workflowType}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  This {workflowType} workflow will cost approximately{" "}
                  <span className="font-bold text-green-400">
                    {formatUsd(analyzedResult.estimatedCost.totalCost)}
                  </span>{" "}
                  and use{" "}
                  <span className="font-bold text-blue-400">
                    {analyzedResult.estimatedTokens.toLocaleString()} tokens
                  </span>
                  .
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
