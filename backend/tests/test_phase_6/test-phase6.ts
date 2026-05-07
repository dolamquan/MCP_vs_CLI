const BASE_URL = "http://localhost:5000";

const sampleComparisons = [
  {
    cliCommand: "npm install express cors dotenv",
    mcpCommand: "Install Express, CORS, and dotenv in my Node.js backend project",
    modelId: "gpt-4.1-mini"
  },
  {
    cliCommand: "npm install prisma @prisma/client",
    mcpCommand: "Install Prisma ORM and Prisma Client for my backend project",
    modelId: "gpt-4.1"
  },
  {
    cliCommand: "npm install zod",
    mcpCommand: "Install Zod for request validation in my TypeScript API",
    modelId: "gpt-4.1-mini"
  }
];

async function testHealthEndpoint() {
  console.log("Testing GET /api/health...");

  const response = await fetch(`${BASE_URL}/api/health`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", data);

  if (response.status !== 200 || data.status !== "ok") {
    throw new Error("Health endpoint failed");
  }

  console.log("Health endpoint passed\n");
}

async function createSampleComparisons() {
  console.log("Creating sample comparison history records...");

  for (const comparison of sampleComparisons) {
    const response = await fetch(`${BASE_URL}/api/comparisons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(comparison)
    });

    const data = await response.json();

    console.log("Status Code:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.status !== 201 || data.success !== true) {
      throw new Error("Failed to create sample comparison history");
    }
  }

  console.log("Sample comparison history records created\n");
}

async function testSummaryReport() {
  console.log("Testing GET /api/reports/summary...");

  const response = await fetch(`${BASE_URL}/api/reports/summary`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200) {
    throw new Error("Summary report endpoint did not return 200");
  }

  if (data.success !== true) {
    throw new Error("Summary report endpoint did not return success true");
  }

  if (typeof data.data.totalComparisons !== "number") {
    throw new Error("Summary report totalComparisons should be a number");
  }

  console.log("GET /api/reports/summary passed\n");
}

async function testChartDataReport() {
  console.log("Testing GET /api/reports/chart-data...");

  const response = await fetch(`${BASE_URL}/api/reports/chart-data`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200) {
    throw new Error("Chart data endpoint did not return 200");
  }

  if (data.success !== true) {
    throw new Error("Chart data endpoint did not return success true");
  }

  if (!Array.isArray(data.data.tokenComparisonData)) {
    throw new Error("tokenComparisonData should be an array");
  }

  if (!Array.isArray(data.data.costComparisonData)) {
    throw new Error("costComparisonData should be an array");
  }

  if (!Array.isArray(data.data.savingsTrendData)) {
    throw new Error("savingsTrendData should be an array");
  }

  if (!Array.isArray(data.data.recommendationBreakdownData)) {
    throw new Error("recommendationBreakdownData should be an array");
  }

  if (!Array.isArray(data.data.modelUsageData)) {
    throw new Error("modelUsageData should be an array");
  }

  console.log("GET /api/reports/chart-data passed\n");
}

async function runPhase6Tests() {
  try {
    console.log("Running Phase 6 reports tests...\n");

    await testHealthEndpoint();
    await createSampleComparisons();
    await testSummaryReport();
    await testChartDataReport();

    console.log("All Phase 6 tests passed.");
  } catch (error) {
    console.error("Phase 6 test failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runPhase6Tests();
