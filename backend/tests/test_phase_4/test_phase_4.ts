const BASE_URL = "http://localhost:5000";

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

async function testGetAllPricing() {
  console.log("Testing GET /api/pricing...");

  const response = await fetch(`${BASE_URL}/api/pricing`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("GET /api/pricing failed");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("Pricing data should be an array");
  }

  if (data.data.length === 0) {
    throw new Error("Pricing config should not be empty");
  }

  const firstModel = data.data[0];

  if (
    !firstModel.modelId ||
    !firstModel.modelName ||
    !firstModel.provider ||
    typeof firstModel.inputCostPer1MTokens !== "number" ||
    typeof firstModel.outputCostPer1MTokens !== "number"
  ) {
    throw new Error("Pricing model shape is incorrect");
  }

  console.log("GET /api/pricing passed\n");
}

async function testGetSinglePricingModel() {
  console.log("Testing GET /api/pricing/gpt-4.1-mini...");

  const response = await fetch(`${BASE_URL}/api/pricing/gpt-4.1-mini`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("GET /api/pricing/gpt-4.1-mini failed");
  }

  if (data.data.modelId !== "gpt-4.1-mini") {
    throw new Error("Returned modelId is incorrect");
  }

  if (typeof data.data.inputCostPer1MTokens !== "number") {
    throw new Error("inputCostPer1MTokens should be a number");
  }

  if (typeof data.data.outputCostPer1MTokens !== "number") {
    throw new Error("outputCostPer1MTokens should be a number");
  }

  console.log("GET /api/pricing/gpt-4.1-mini passed\n");
}

async function testInvalidPricingModel() {
  console.log("Testing invalid pricing model...");

  const response = await fetch(`${BASE_URL}/api/pricing/not-a-real-model`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", data);

  if (response.status !== 400 || data.success !== false) {
    throw new Error("Invalid pricing model test failed");
  }

  console.log("Invalid pricing model test passed\n");
}

async function testComparisonWithModelPricing() {
  console.log("Testing POST /api/comparisons with modelId...");

  const response = await fetch(`${BASE_URL}/api/comparisons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cliCommand: "npm install express cors dotenv",
      mcpCommand:
        "Install Express, CORS, and dotenv in my Node.js backend project",
      modelId: "gpt-4.1-mini"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 201 || data.success !== true) {
    throw new Error("Comparison with model pricing failed");
  }

  if (data.data.comparison.modelId !== "gpt-4.1-mini") {
    throw new Error("Comparison did not use the selected modelId");
  }

  if (!data.data.comparison.cli || !data.data.comparison.mcp) {
    throw new Error("Comparison response is missing cli or mcp data");
  }

  if (data.data.comparison.cli.estimatedCost.modelId !== "gpt-4.1-mini") {
    throw new Error("CLI estimated cost did not use selected model pricing");
  }

  if (data.data.comparison.mcp.estimatedCost.modelId !== "gpt-4.1-mini") {
    throw new Error("MCP estimated cost did not use selected model pricing");
  }

  if (typeof data.data.comparison.cli.estimatedCost.totalCost !== "number") {
    throw new Error("CLI totalCost should be a number");
  }

  if (typeof data.data.comparison.mcp.estimatedCost.totalCost !== "number") {
    throw new Error("MCP totalCost should be a number");
  }

  console.log("POST /api/comparisons with modelId passed\n");
}

async function testComparisonWithInvalidModelId() {
  console.log("Testing POST /api/comparisons with invalid modelId...");

  const response = await fetch(`${BASE_URL}/api/comparisons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cliCommand: "npm install express",
      mcpCommand: "Install Express in my backend project",
      modelId: "fake-model"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", data);

  if (response.status !== 400 || data.success !== false) {
    throw new Error("Invalid modelId comparison validation failed");
  }

  console.log("Invalid modelId comparison test passed\n");
}

async function runPhase4Tests() {
  try {
    console.log("Running Phase 4 tests...\n");

    await testHealthEndpoint();
    await testGetAllPricing();
    await testGetSinglePricingModel();
    await testInvalidPricingModel();
    await testComparisonWithModelPricing();
    await testComparisonWithInvalidModelId();

    console.log("All Phase 4 tests passed.");
  } catch (error) {
    console.error("Phase 4 test failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runPhase4Tests();
