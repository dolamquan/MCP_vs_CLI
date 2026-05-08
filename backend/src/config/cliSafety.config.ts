export const ALLOWED_COMMANDS = [
  "node",
  "npm",
  "npx",
  "git",
  "tsc",
  "tsx",
  "echo",
  "pwd",
  "ls",
  "dir"
];

export const BLOCKED_COMMANDS = [
  "rm",
  "rmdir",
  "del",
  "erase",
  "format",
  "shutdown",
  "reboot",
  "sudo",
  "su",
  "chmod",
  "chown",
  "curl",
  "wget",
  "scp",
  "ssh",
  "powershell",
  "Invoke-WebRequest"
];

export const BLOCKED_PATTERNS = [
  "rm -rf",
  "del /s",
  "format ",
  "shutdown",
  "reboot",
  "sudo ",
  "&&",
  "||",
  ";",
  "|",
  ">",
  ">>",
  "<",
  "`",
  "$(",
  "%COMSPEC%"
];

export const MAX_COMMAND_LENGTH = 300;

export const COMMAND_TIMEOUT_MS = 10_000;