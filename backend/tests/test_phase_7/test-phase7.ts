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

async function testCliManualMode() {
  console.log("Testing POST /api/cli/run manual mode...");

  const response = await fetch(`${BASE_URL}/api/cli/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "npm --version",
      mode: "manual"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("CLI manual mode failed");
  }

  if (data.data.executed !== false) {
    throw new Error("Manual mode should not execute the command");
  }

  if (data.data.safety.isSafe !== true) {
    throw new Error("Safe command should pass safety validation");
  }

  console.log("CLI manual mode passed\n");
}

async function testCliSandboxMode() {
  console.log("Testing POST /api/cli/run sandbox mode...");

  const response = await fetch(`${BASE_URL}/api/cli/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "node --version",
      mode: "sandbox"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("CLI sandbox mode failed");
  }

  if (data.data.executed !== true) {
    throw new Error("Sandbox mode should execute safe commands");
  }

  if (typeof data.data.stdout !== "string") {
    throw new Error("stdout should be a string");
  }

  console.log("CLI sandbox mode passed\n");
}

async function testBlockedCommand() {
  console.log("Testing blocked dangerous command...");

  const response = await fetch(`${BASE_URL}/api/cli/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "rm -rf node_modules",
      mode: "sandbox"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 400 || data.success !== false) {
    throw new Error("Blocked command test failed");
  }

  if (data.data.executed !== false) {
    throw new Error("Blocked command should not execute");
  }

  if (data.data.safety.isSafe !== false) {
    throw new Error("Blocked command should fail safety validation");
  }

  console.log("Blocked command test passed\n");
}

async function testInvalidMode() {
  console.log("Testing invalid CLI mode...");

  const response = await fetch(`${BASE_URL}/api/cli/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "node --version",
      mode: "danger"
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 400 || data.success !== false) {
    throw new Error("Invalid mode validation failed");
  }

  console.log("Invalid mode test passed\n");
}

async function runPhase7Tests() {
  try {
    console.log("Running Phase 7 CLI tests...\n");

    await testHealthEndpoint();
    await testCliManualMode();
    await testCliSandboxMode();
    await testBlockedCommand();
    await testInvalidMode();

    console.log("All Phase 7 tests passed.");
  } catch (error) {
    console.error("Phase 7 test failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runPhase7Tests();