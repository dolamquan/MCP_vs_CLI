import {
    ALLOWED_COMMANDS,
    BLOCKED_COMMANDS,
    BLOCKED_PATTERNS,
    MAX_COMMAND_LENGTH,
} from '../config/cliSafety.config';

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
    const trimmedCommand = command.trim();

    if(!trimmedCommand) {
        const result: CliSafetyService = {
            isSafe: false,
            reason: 'Command is empty or whitespace.',
            baseCommand: null,
        };
        return result;
    }

    if (trimmedCommand.length > MAX_COMMAND_LENGTH) {
        const result: CliSafetyService = {
            isSafe: false,
            reason: `Command exceeds maximum length of ${MAX_COMMAND_LENGTH} characters.`,
            baseCommand: null,
        };
        return result;
    }

    const lowerCommand = trimmedCommand.toLowerCase();
    const baseCommand = getBaseCommand(trimmedCommand);

    if (!baseCommand) {
        const result: CliSafetyService = {
            isSafe: false,
            reason: 'Unable to determine base command.',
            baseCommand: null,
        };
        return result;
    }

    const normalizedBaseCommand = baseCommand.toLowerCase();
    const hasBlockedPattern = BLOCKED_PATTERNS.some((pattern) =>
        lowerCommand.includes(pattern.toLowerCase())
    );

    if (hasBlockedPattern) {
        const result: CliSafetyService = {
            isSafe: false,
            reason: 'Command contains blocked patterns.',
            baseCommand: normalizedBaseCommand,
        };
        return result;
    }

    const isBlockedCommand = BLOCKED_COMMANDS.some(
        (blocked) => blocked.toLowerCase() === normalizedBaseCommand
    );

    if (isBlockedCommand) {
        const result: CliSafetyService = {
            isSafe: false,
            reason: 'Command is explicitly blocked.',
            baseCommand: normalizedBaseCommand,
        };
        return result;
    }

    const isAllowedCommand = ALLOWED_COMMANDS.some(
        (allowed) => allowed.toLowerCase() === normalizedBaseCommand
    );

    if (!isAllowedCommand) {
        const result: CliSafetyService = {
            isSafe: false,
            reason: 'Command is not in the list of allowed commands.',
            baseCommand: normalizedBaseCommand,
        };
        return result;
    }

    const result: CliSafetyService = {
        isSafe: true,
        reason: 'Command is safe to execute.',
        baseCommand: normalizedBaseCommand,
    };
    return result;
};