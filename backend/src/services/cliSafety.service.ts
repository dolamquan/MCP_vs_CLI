import { getCliRules } from "./cliRegistry.service";

export interface CliSafetyService {
  isSafe: boolean;
  reason: string;
  baseCommand: string | null;
}

const getBaseCommand = (command: string): string | null => {
  const trimmedCommand = command.trim();

  if (!trimmedCommand) {
    return null;
  }

  return trimmedCommand.split(/\s+/)[0];
};

export const checkCommandSafety = (command: string): CliSafetyService => {
  const rules = getCliRules();

  const trimmedCommand = command.trim();

  if (!trimmedCommand) {
    return {
      isSafe: false,
      reason: "Command is empty or whitespace.",
      baseCommand: null
    };
  }

  if (trimmedCommand.length > rules.maxCommandLength) {
    return {
      isSafe: false,
      reason: `Command exceeds maximum length of ${rules.maxCommandLength} characters.`,
      baseCommand: null
    };
  }

  const lowerCommand = trimmedCommand.toLowerCase();
  const baseCommand = getBaseCommand(trimmedCommand);

  if (!baseCommand) {
    return {
      isSafe: false,
      reason: "Unable to determine base command.",
      baseCommand: null
    };
  }

  const normalizedBaseCommand = baseCommand.toLowerCase();

  const hasBlockedPattern = rules.blockedPatterns.some((pattern) =>
    lowerCommand.includes(pattern.toLowerCase())
  );

  if (hasBlockedPattern) {
    return {
      isSafe: false,
      reason: "Command contains blocked patterns.",
      baseCommand: normalizedBaseCommand
    };
  }

  const isBlockedCommand = rules.blockedCommands.some(
    (blocked) => blocked.toLowerCase() === normalizedBaseCommand
  );

  if (isBlockedCommand) {
    return {
      isSafe: false,
      reason: "Command is explicitly blocked.",
      baseCommand: normalizedBaseCommand
    };
  }

  const isAllowedCommand = rules.allowedCommands.some(
    (allowed) => allowed.toLowerCase() === normalizedBaseCommand
  );

  if (!isAllowedCommand) {
    return {
      isSafe: false,
      reason: "Command is not in the list of allowed commands.",
      baseCommand: normalizedBaseCommand
    };
  }

  return {
    isSafe: true,
    reason: "Command is safe to execute.",
    baseCommand: normalizedBaseCommand
  };
};