import { execFile } from "child_process";
import { promisify } from "util";
import { COMMAND_TIMEOUT_MS } from "../config/cliSafety.config";
import { checkCommandSafety } from "./cliSafety.service";


const execFileAsync = promisify(execFile);

export type CliExecutionMode = "manual" | "sandbox";

export interface CliRunInput {
    command: string;
    mode: CliExecutionMode;
}

export interface CliRunResult {
    mode: CliExecutionMode;
    command: string;
    safety:{
        isSafe: boolean;
        reason: string;
        baseCommand: string|null;
    };
    executed: boolean;
    stdout: string;
    stderr: string;
    exitCode: number | null;
}

const splitCommand = (command: string):{
    executable: string;
    args: string[];
} => {
    const parts = command.trim().split(/\s+/);
    const executable = parts[0];
    const args = parts.slice(1); // Takes a portion of an array and returns a new one
    return { executable, args };
};

export const runCliCommand = async (input: CliRunInput): Promise<CliRunResult> => {
    const { command, mode } = input;
    const safetyResult = checkCommandSafety(command);
    if (!safetyResult.isSafe) {
        return {
            mode,
            command,
            safety: safetyResult,
            executed: false,
            stdout: "",
            stderr: safetyResult.reason,
            exitCode: null
        };
    }

    if (mode === "manual") {
        return {
            mode,
            command,
            safety: safetyResult,
            executed: false,
            stdout: `Manual mode selected. Copy and run this command yourself: ${command}`,
            stderr: "",
            exitCode: null
        };
    }
    
    const { executable, args } = splitCommand(command);
    try {
        const result = await execFileAsync(executable, args, {
            timeout: COMMAND_TIMEOUT_MS,
            windowsHide: true
        });
        return {
            mode,
            command,
            safety: safetyResult,
            executed: true,
            stdout: result.stdout.trim(),
            stderr: result.stderr.trim(),
            exitCode: 0
        };
    } catch (error: any) {
        const cliError = error as {
            stdout?: string;
            stderr?: string;
            code?: number;
            message?: string;

        };
        return {
            mode,
            command,
            safety: safetyResult,
            executed: true,
            stdout: cliError.stdout ? cliError.stdout.trim() : "",
            stderr: cliError.stderr ? cliError.stderr.trim() : (cliError.message || "Unknown error"),
            exitCode: cliError.code !== undefined ? cliError.code : null
        };
    }
};