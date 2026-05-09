const BASE_URL = "http://localhost:5000";

let createdHistoryId: string | null = null;

async function requestJson(
  url: string,
  options?: RequestInit
): Promise<{ response: Response; data: any }> {
  const response = await fetch(url, options);
  const text = await response.text();

  let data: any;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { response, data };
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function testHealth() {
  console.log("Testing health...");

  const { response, data } = await requestJson(`${BASE_URL}/api/health`);

  assert(response.status === 200, "Health should return 200");
  assert(data.status === "ok", "Health should return status ok");

  console.log("Health passed\n");
}

async function testPricing() {
  console.log("Testing pricing...");

  const allPricing = await requestJson(`${BASE_URL}/api/pricing`);

  assert(allPricing.response.status === 200, "GET /api/pricing should return 200");
  assert(allPricing.data.success === true, "Pricing response should be successful");
  assert(Array.isArray(allPricing.data.data), "Pricing data should be an array");

  const singlePricing = await requestJson(
    `${BASE_URL}/api/pricing/gpt-4.1-mini`
  );

  assert(
    singlePricing.response.status === 200,
    "GET /api/pricing/gpt-4.1-mini should return 200"
  );
  assert(
    singlePricing.data.data.modelId === "gpt-4.1-mini",
    "Single pricing should return gpt-4.1-mini"
  );

  console.log("Pricing passed\n");
}

async function testComparisonAndHistory() {
  console.log("Testing comparison and history...");

  const { response, data } = await requestJson(`${BASE_URL}/api/comparisons`, {
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

  assert(
    response.status === 201 || response.status === 200,
    "POST /api/comparisons should return 200 or 201"
  );
  assert(data.success === true, "Comparison response should be successful");

  const savedRecord = data.data.savedRecord;

  assert(savedRecord, "Comparison response should include savedRecord");
  assert(savedRecord.id, "Saved record should include id");

  createdHistoryId = savedRecord.id;

  const history = await requestJson(`${BASE_URL}/api/history`);

  assert(history.response.status === 200, "GET /api/history should return 200");
  assert(history.data.success === true, "History response should be successful");
  assert(Array.isArray(history.data.data), "History data should be an array");

  const foundItem = history.data.data.find(
    (item: { id: string }) => item.id === createdHistoryId
  );

  assert(Boolean(foundItem), "Created comparison should exist in history");

  const historyById = await requestJson(
    `${BASE_URL}/api/history/${createdHistoryId}`
  );

  assert(
    historyById.response.status === 200,
    "GET /api/history/:id should return 200"
  );
  assert(
    historyById.data.data.id === createdHistoryId,
    "History item id should match"
  );

  console.log("Comparison and history passed\n");
}

async function testReports() {
  console.log("Testing reports...");

  const summary = await requestJson(`${BASE_URL}/api/reports/summary`);

  assert(
    summary.response.status === 200,
    "GET /api/reports/summary should return 200"
  );
  assert(summary.data.success === true, "Summary report should be successful");
  assert(
    typeof summary.data.data.totalComparisons === "number",
    "Summary should include totalComparisons"
  );

  const chartData = await requestJson(`${BASE_URL}/api/reports/chart-data`);

  assert(
    chartData.response.status === 200,
    "GET /api/reports/chart-data should return 200"
  );
  assert(chartData.data.success === true, "Chart data response should be successful");
  assert(
    Array.isArray(chartData.data.data.tokenComparisonData),
    "tokenComparisonData should be an array"
  );
  assert(
    Array.isArray(chartData.data.data.costComparisonData),
    "costComparisonData should be an array"
  );
  assert(
    Array.isArray(chartData.data.data.savingsTrendData),
    "savingsTrendData should be an array"
  );
  assert(
    Array.isArray(chartData.data.data.recommendationBreakdownData),
    "recommendationBreakdownData should be an array"
  );
  assert(
    Array.isArray(chartData.data.data.modelUsageData),
    "modelUsageData should be an array"
  );

  console.log("Reports passed\n");
}

async function testCli() {
  console.log("Testing CLI...");

  const manual = await requestJson(`${BASE_URL}/api/cli/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "node --version",
      mode: "manual"
    })
  });

  assert(manual.response.status === 200, "CLI manual mode should return 200");
  assert(manual.data.success === true, "CLI manual mode should be successful");
  assert(
    manual.data.data.executed === false,
    "Manual mode should not execute command"
  );

  const sandbox = await requestJson(`${BASE_URL}/api/cli/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "node --version",
      mode: "sandbox"
    })
  });

  assert(sandbox.response.status === 200, "CLI sandbox mode should return 200");
  assert(sandbox.data.success === true, "CLI sandbox mode should be successful");
  assert(
    sandbox.data.data.executed === true,
    "Sandbox mode should execute safe command"
  );

  const blocked = await requestJson(`${BASE_URL}/api/cli/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "rm -rf node_modules",
      mode: "sandbox"
    })
  });

  assert(
    blocked.response.status === 400,
    "Blocked CLI command should return 400"
  );
  assert(blocked.data.success === false, "Blocked command should fail");
  assert(
    blocked.data.data.executed === false,
    "Blocked command should not execute"
  );

  console.log("CLI passed\n");
}

async function testMcpOptional() {
  console.log("Testing MCP if enabled...");

  const servers = await requestJson(`${BASE_URL}/api/mcp/servers`);

  if (servers.response.status !== 200) {
    console.log("Skipping MCP because /api/mcp/servers is not available\n");
    return;
  }

  assert(servers.data.success === true, "MCP servers response should be successful");
  assert(Array.isArray(servers.data.data), "MCP servers data should be an array");

  if (servers.data.data.length === 0) {
    console.log("Skipping MCP tool discovery because no MCP servers are enabled\n");
    return;
  }

  const firstServer = servers.data.data[0];

  const tools = await requestJson(
    `${BASE_URL}/api/mcp/servers/${firstServer.serverId}/tools`
  );

  assert(
    tools.response.status === 200,
    `MCP tool discovery should return 200 for ${firstServer.serverId}`
  );
  assert(tools.data.success === true, "MCP tools response should be successful");
  assert(Array.isArray(tools.data.data), "MCP tools data should be an array");

  console.log("MCP passed\n");
}

async function testSettings() {
  console.log("Testing settings...");

  const getSettings = await requestJson(`${BASE_URL}/api/settings`);

  assert(
    getSettings.response.status === 200,
    "GET /api/settings should return 200"
  );
  assert(getSettings.data.success === true, "Settings response should be successful");

  const updateSettings = await requestJson(`${BASE_URL}/api/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      defaultExportFormat: "csv",
      maxHistoryItems: 50
    })
  });

  assert(
    updateSettings.response.status === 200,
    "PATCH /api/settings should return 200"
  );
  assert(
    updateSettings.data.data.defaultExportFormat === "csv",
    "defaultExportFormat should update to csv"
  );
  assert(
    updateSettings.data.data.maxHistoryItems === 50,
    "maxHistoryItems should update to 50"
  );

  console.log("Settings passed\n");
}

async function testExport() {
  console.log("Testing export...");

  const jsonExport = await fetch(`${BASE_URL}/api/export/history/json`);
  const jsonText = await jsonExport.text();

  assert(jsonExport.status === 200, "JSON export should return 200");

  const parsedJson = JSON.parse(jsonText);

  assert(Array.isArray(parsedJson), "JSON export should return an array");

  const csvExport = await fetch(`${BASE_URL}/api/export/history/csv`);
  const csvText = await csvExport.text();

  assert(csvExport.status === 200, "CSV export should return 200");
  assert(csvText.includes("cliCommand"), "CSV should include cliCommand header");
  assert(csvText.includes("mcpCommand"), "CSV should include mcpCommand header");

  console.log("Export passed\n");
}

async function testNotFound() {
  console.log("Testing 404 middleware...");

  const { response, data } = await requestJson(
    `${BASE_URL}/api/this-route-does-not-exist`
  );

  assert(response.status === 404, "Unknown route should return 404");
  assert(data.success === false, "Unknown route should return success false");

  console.log("404 middleware passed\n");
}

async function cleanupCreatedHistory() {
  if (!createdHistoryId) {
    return;
  }

  console.log("Cleaning up created history record...");

  const { response } = await requestJson(
    `${BASE_URL}/api/history/${createdHistoryId}`,
    {
      method: "DELETE"
    }
  );

  if (response.status === 200) {
    console.log("Cleanup passed\n");
  } else {
    console.log("Cleanup skipped or failed, but tests already completed\n");
  }
}

async function runAllTests() {
  try {
    console.log("Running all backend tests...\n");

    await testHealth();
    await testPricing();
    await testComparisonAndHistory();
    await testReports();
    await testCli();
    await testMcpOptional();
    await testSettings();
    await testExport();
    await testNotFound();

    await cleanupCreatedHistory();

    console.log("All backend tests passed.");
  } catch (error) {
    console.error("Test failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runAllTests();