"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparison_service_1 = require("../../src/services/comparison.service");
const result = (0, comparison_service_1.compareCommands)({
    cliCommand: "npx create-next-app@latest my-app",
    mcpCommand: "Create a new Next.js app with TypeScript, Tailwind CSS, ESLint, and App Router enabled"
});
console.log(JSON.stringify(result, null, 2));
