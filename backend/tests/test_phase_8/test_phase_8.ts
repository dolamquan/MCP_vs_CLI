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

async function testMcpServersEndpoint() {
  console.log("Testing GET /api/mcp/servers...");

  const response = await fetch(`${BASE_URL}/api/mcp/servers`);
  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("MCP servers endpoint failed");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("MCP servers data should be an array");
  }

  if (data.data.length === 0) {
    throw new Error("At least one MCP server should be configured");
  }

  console.log("MCP servers endpoint passed\n");
}

async function testMcpToolDiscovery() {
  console.log("Testing GET /api/mcp/servers/filesystem-local/tools...");

  const response = await fetch(
    `${BASE_URL}/api/mcp/servers/filesystem-local/tools`
  );

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("MCP tool discovery failed");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("MCP tools data should be an array");
  }

  console.log("MCP tool discovery passed\n");

  return data.data;
}

async function testMcpToolCall(tools: any[]) {
  console.log("Testing POST /api/mcp/call-tool...");

  const listDirectoryTool = tools.find(
    (tool) => tool.name === "list_directory"
  );

  if (!listDirectoryTool) {
    console.log(
      "Skipping tool call test because list_directory was not found on this MCP server."
    );
    return;
  }

  const response = await fetch(`${BASE_URL}/api/mcp/call-tool`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      serverId: "filesystem-local",
      toolName: "list_directory",
      arguments: {
        path: "."
      }
    })
  });

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 200 || data.success !== true) {
    throw new Error("MCP tool call failed");
  }

  if (typeof data.data.requestTokens !== "number") {
    throw new Error("requestTokens should be a number");
  }

  if (typeof data.data.resultTokens !== "number") {
    throw new Error("resultTokens should be a number");
  }

  if (typeof data.data.totalTokens !== "number") {
    throw new Error("totalTokens should be a number");
  }

  console.log("MCP tool call passed\n");
}

async function testInvalidMcpServer() {
  console.log("Testing invalid MCP server...");

  const response = await fetch(
    `${BASE_URL}/api/mcp/servers/fake-server/tools`
  );

  const data = await response.json();

  console.log("Status Code:", response.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (response.status !== 404 || data.success !== false) {
    throw new Error("Invalid MCP server test failed");
  }

  console.log("Invalid MCP server test passed\n");
}

async function runPhase9Tests() {
  try {
    console.log("Running Phase 9 real MCP client tests...\n");

    await testHealthEndpoint();
    await testMcpServersEndpoint();

    const tools = await testMcpToolDiscovery();

    await testMcpToolCall(tools);
    await testInvalidMcpServer();

    console.log("All Phase 9 tests passed.");
  } catch (error) {
    console.error("Phase 9 test failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runPhase9Tests();