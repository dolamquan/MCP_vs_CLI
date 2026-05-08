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

async function testComparisonEndpoint() {
  console.log("Testing POST /api/comparisons...");

  const response = await fetch(`${BASE_URL}/api/comparisons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cliCommand: "npx create-next-app@latest my-app",
      mcpCommand:
        "Create a new Next.js app with TypeScript, Tailwind CSS, ESLint, and App Router enabled"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 201 || data.success !== true) {
    throw new Error("Comparison endpoint failed");
  }

  if (!data.data.comparison || !data.data.savedRecord) {
    throw new Error("Comparison response shape is incorrect");
  }

  console.log("Comparison endpoint passed\n");
}

async function testValidationError() {
  console.log("Testing validation error for POST /api/comparisons...");

  const response = await fetch(`${BASE_URL}/api/comparisons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cliCommand: "",
      mcpCommand: "Create a new app"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", data);

  if (response.status !== 400 || data.success !== false) {
    throw new Error("Validation test failed");
  }

  console.log("Validation test passed\n");
}

async function runPhase3Tests() {
  try {
    console.log("Running Phase 3 API tests...\n");

    await testHealthEndpoint();
    await testComparisonEndpoint();
    await testValidationError();

    console.log("All Phase 3 tests passed.");
  } catch (error) {
    console.error("Phase 3 test failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runPhase3Tests();
