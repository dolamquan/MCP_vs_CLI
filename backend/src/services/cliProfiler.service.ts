import { runCliCommand } from "./cliRunner.service";
import { countTokens } from "./tokenCounter.service";
import { estimateCost } from "./costEstimator.service";
import { CliProfileInput, CliProfileResult } from "../types/profiler.types";

export const profileCliCommand = async (
  input: CliProfileInput
): Promise<CliProfileResult> => {
  const result = await runCliCommand({
    command: input.command,
    mode: input.mode
  });

  const inputTokens = countTokens(input.command);

  const outputText = [
    result.stdout,
    result.stderr
  ].filter(Boolean).join("\n");

  const outputTokens = countTokens(outputText);

  const cost = estimateCost(inputTokens, outputTokens, input.modelId);

  return {
    type: "cli",
    command: input.command,
    mode: input.mode,
    executed: result.executed,
    stdout: result.stdout,
    stderr: result.stderr,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    cost
  };
};