import { spawn } from "child_process";
import path from "path";

const phaseTests = [
  "tests/test_phase_2/test_phase_2.ts",
  "tests/test_phase_3/test_phase_3.ts",
  "tests/test_phase_4/test_phase_4.ts",
  "tests/test_phase_5/test_phase_5.ts",
  "tests/test_phase_6/test_phase_6.ts",
  "tests/test_phase_7/test_phase_7.ts",
  "tests/test_phase_8/test_phase_8.ts",
  "tests/test_phase_9/test_phase_9.ts"
];

const runTestFile = (relativeFilePath: string) => {
  return new Promise<void>((resolve, reject) => {
    const absoluteFilePath = path.resolve(process.cwd(), relativeFilePath);
    const tsNodeBin = require.resolve("ts-node/dist/bin.js");

    const child = spawn(
      process.execPath,
      [tsNodeBin, "--transpile-only", absoluteFilePath],
      {
        cwd: process.cwd(),
        stdio: "inherit"
      }
    );

    child.on("error", reject);

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${relativeFilePath} failed with exit code ${code}`));
    });
  });
};

async function runAllTests() {
  try {
    console.log("Running all phase tests...\n");

    for (const phaseTest of phaseTests) {
      console.log(`Starting ${phaseTest}...\n`);
      await runTestFile(phaseTest);
      console.log(`Finished ${phaseTest}.\n`);
    }

    console.log("All phase tests passed.");
  } catch (error) {
    console.error("Test suite failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

runAllTests();
