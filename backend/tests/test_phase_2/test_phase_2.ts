import {compareCommands} from "../../src/services/comparison.service";

const result = compareCommands({
  cliCommand: "npx create-next-app@latest my-app",
  mcpCommand: "Create a new Next.js app with TypeScript, Tailwind CSS, ESLint, and App Router enabled"
});

console.log(JSON.stringify(result, null, 2));