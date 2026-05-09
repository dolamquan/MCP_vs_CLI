import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { api, AppSettings, PricingModel } from "../lib/api";

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [models, setModels] = useState<PricingModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setMessage(null);
        const [settingsData, pricingModels] = await Promise.all([
          api.getSettings(),
          api.getPricing(),
        ]);
        setSettings(settingsData);
        setModels(pricingModels);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load settings."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const updateField = <K extends keyof AppSettings>(field: K, value: AppSettings[K]) => {
    setSettings((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  const saveSettings = async () => {
    if (!settings) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage(null);
      const updatedSettings = await api.updateSettings(settings);
      setSettings(updatedSettings);
      setMessage("Settings saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save settings."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="p-12 text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="p-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2">Settings</h1>
        <p className="text-gray-500">Configure backend-compatible defaults for comparison and export behavior.</p>
      </div>

      {message && (
        <Card className="bg-white/[0.02] border-white/5">
          <CardContent className="p-4 text-sm text-gray-300">{message}</CardContent>
        </Card>
      )}

      <div className="grid gap-6 max-w-4xl">
        {/* Default Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg">Default Model</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Default Model</Label>
                  <Select value={settings.defaultModelId} onValueChange={(value) => updateField("defaultModelId", value)}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.modelId} value={model.modelId}>
                          {model.modelName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">Max History Items</Label>
                  <Input
                    type="number"
                    min={1}
                    value={settings.maxHistoryItems}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value);
                      updateField("maxHistoryItems", Number.isNaN(nextValue) ? settings.maxHistoryItems : nextValue);
                    }}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-black" onClick={saveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Execution Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg">Execution Preferences</CardTitle>
              <CardDescription className="text-gray-500">
                Control whether CLI and MCP execution endpoints can run.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-400">Enable CLI execution</Label>
                <Switch
                  checked={settings.enableCliExecution}
                  onCheckedChange={(checked) => updateField("enableCliExecution", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-400">Enable MCP execution</Label>
                <Switch
                  checked={settings.enableMCPExecution}
                  onCheckedChange={(checked) => updateField("enableMCPExecution", checked)}
                />
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-black" onClick={saveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Export Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg">Export Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Default Export Format</Label>
                <Select
                  value={settings.defaultExportFormat}
                  onValueChange={(value) => updateField("defaultExportFormat", value as "json" | "csv")}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-black" onClick={saveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-lg">Dashboard Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-400">Save history</Label>
                <Switch checked={settings.saveHistory} onCheckedChange={(checked) => updateField("saveHistory", checked)} />
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-black" onClick={saveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="border-b border-red-500/20">
              <CardTitle className="text-lg text-red-400">Backend Config Note</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm text-gray-300">
              Settings on this page are loaded from and persisted to the backend using /api/settings.
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
