const BASE_URL = "http://localhost:5000";

async function testHealthEndpoint() {
  console.log("Testing GET /api/health...");

  const response = await fetch(`${BASE_URL}/api/health`);
  const data = await response.json();

  if (response.status !== 200 || data.status !== "ok") {
    throw new Error("Health endpoint failed");
  }

  console.log("Health endpoint passed\n");
}

async function testGetSettings() {
  console.log("Testing GET /api/settings...");

  const response = await fetch(`${BASE_URL}/api/settings`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("GET /api/settings failed");
  }

  if (!data.data.defaultModelId) {
    throw new Error("Settings response missing defaultModelId");
  }

  console.log("GET /api/settings passed\n");
}

async function testUpdateSettings() {
  console.log("Testing PATCH /api/settings...");

  const response = await fetch(`${BASE_URL}/api/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      defaultExportFormat: "csv",
      maxHistoryItems: 50
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("PATCH /api/settings failed");
  }

  if (data.data.defaultExportFormat !== "csv") {
    throw new Error("defaultExportFormat was not updated");
  }

  if (data.data.maxHistoryItems !== 50) {
    throw new Error("maxHistoryItems was not updated");
  }

  console.log("PATCH /api/settings passed\n");
}

async function createSampleComparison() {
  console.log("Creating sample comparison for export...");

  const response = await fetch(`${BASE_URL}/api/comparisons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cliCommand: "npm install express",
      mcpCommand: "Install Express in this backend project",
      modelId: "gpt-4.1-mini"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);

  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Failed to create sample comparison");
  }

  if (data.success !== true) {
    throw new Error("Sample comparison response was not successful");
  }

  console.log("Sample comparison created\n");
}

async function testJsonExport() {
  console.log("Testing GET /api/export/history/json...");

  const response = await fetch(`${BASE_URL}/api/export/history/json`);
  const text = await response.text();

  console.log("Status Code:", response.status);
  console.log("Response Preview:", text.slice(0, 300));

  if (response.status !== 200) {
    throw new Error("JSON export failed");
  }

  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error("JSON export should return an array");
  }

  console.log("JSON export passed\n");
}

async function testCsvExport() {
  console.log("Testing GET /api/export/history/csv...");

  const response = await fetch(`${BASE_URL}/api/export/history/csv`);
  const text = await response.text();

  console.log("Status Code:", response.status);
  console.log("Response Preview:", text.slice(0, 300));

  if (response.status !== 200) {
    throw new Error("CSV export failed");
  }

  if (!text.includes("cliCommand") || !text.includes("mcpCommand")) {
    throw new Error("CSV export missing expected headers");
  }

  console.log("CSV export passed\n");
}

async function runPhase9SettingsExportTests() {
  try {
    console.log("Running Phase 9 settings and export tests...\n");

    await testHealthEndpoint();
    await testGetSettings();
    await testUpdateSettings();
    await createSampleComparison();
    await testJsonExport();
    await testCsvExport();

    console.log("All Phase 9 settings/export tests passed.");
  } catch (error) {
    console.error("Phase 9 settings/export test failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runPhase9SettingsExportTests();