"use strict";
const BASE_URL = "http://localhost:5000";
let createdHistoryId = null;
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
async function testCreateComparisonAndSaveToDatabase() {
    console.log("Testing POST /api/comparisons saves to database...");
    const response = await fetch(`${BASE_URL}/api/comparisons`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cliCommand: "npm install express cors dotenv",
            mcpCommand: "Install Express, CORS, and dotenv in my Node.js backend project",
            modelId: "gpt-4.1-mini"
        })
    });
    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    if (response.status !== 201 || data.success !== true) {
        throw new Error("POST /api/comparisons failed");
    }
    if (!data.data.comparison) {
        throw new Error("Response is missing comparison result");
    }
    if (!data.data.savedRecord) {
        throw new Error("Response is missing saved database record");
    }
    if (!data.data.savedRecord.id) {
        throw new Error("Saved record is missing an id");
    }
    if (data.data.savedRecord.modelId !== "gpt-4.1-mini") {
        throw new Error("Saved record did not store the selected modelId");
    }
    createdHistoryId = data.data.savedRecord.id;
    console.log("POST /api/comparisons saved to database passed\n");
}
async function testGetHistory() {
    console.log("Testing GET /api/history...");
    const response = await fetch(`${BASE_URL}/api/history`);
    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    if (response.status !== 200 || data.success !== true) {
        throw new Error("GET /api/history failed");
    }
    if (!Array.isArray(data.data)) {
        throw new Error("History data should be an array");
    }
    if (data.data.length === 0) {
        throw new Error("History should contain at least one saved comparison");
    }
    if (!createdHistoryId) {
        throw new Error("No created history id found from previous test");
    }
    const savedItem = data.data.find((item) => item.id === createdHistoryId);
    if (!savedItem) {
        throw new Error("Created comparison was not found in history");
    }
    console.log("GET /api/history passed\n");
}
async function testGetHistoryById() {
    console.log("Testing GET /api/history/:id...");
    if (!createdHistoryId) {
        throw new Error("No created history id available");
    }
    const response = await fetch(`${BASE_URL}/api/history/${createdHistoryId}`);
    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    if (response.status !== 200 || data.success !== true) {
        throw new Error("GET /api/history/:id failed");
    }
    if (data.data.id !== createdHistoryId) {
        throw new Error("Returned history item id does not match");
    }
    if (data.data.cliCommand !== "npm install express cors dotenv") {
        throw new Error("Returned history item has incorrect cliCommand");
    }
    if (data.data.modelId !== "gpt-4.1-mini") {
        throw new Error("Returned history item has incorrect modelId");
    }
    console.log("GET /api/history/:id passed\n");
}
async function testGetInvalidHistoryById() {
    console.log("Testing GET /api/history with invalid id...");
    const fakeId = "not-a-real-id";
    const response = await fetch(`${BASE_URL}/api/history/${fakeId}`);
    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response:", data);
    if (response.status !== 404 || data.success !== false) {
        throw new Error("Invalid history id test failed");
    }
    console.log("Invalid history id test passed\n");
}
async function testDeleteHistoryById() {
    console.log("Testing DELETE /api/history/:id...");
    if (!createdHistoryId) {
        throw new Error("No created history id available");
    }
    const response = await fetch(`${BASE_URL}/api/history/${createdHistoryId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response:", data);
    if (response.status !== 200 || data.success !== true) {
        throw new Error("DELETE /api/history/:id failed");
    }
    console.log("DELETE /api/history/:id passed\n");
}
async function testDeletedHistoryCannotBeFound() {
    console.log("Testing deleted history item cannot be found...");
    if (!createdHistoryId) {
        throw new Error("No created history id available");
    }
    const response = await fetch(`${BASE_URL}/api/history/${createdHistoryId}`);
    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response:", data);
    if (response.status !== 404 || data.success !== false) {
        throw new Error("Deleted history item should not be found");
    }
    console.log("Deleted history item not found test passed\n");
}
async function runPhase5Tests() {
    try {
        console.log("Running Phase 5 database and history tests...\n");
        await testHealthEndpoint();
        await testCreateComparisonAndSaveToDatabase();
        await testGetHistory();
        await testGetHistoryById();
        await testGetInvalidHistoryById();
        await testDeleteHistoryById();
        await testDeletedHistoryCannotBeFound();
        console.log("All Phase 5 tests passed.");
    }
    catch (error) {
        console.error("Phase 5 test failed.");
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        process.exit(1);
    }
}
runPhase5Tests();
