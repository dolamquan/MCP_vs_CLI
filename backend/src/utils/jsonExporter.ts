export const buildJsonExport = (data:unknown): string => {
    return JSON.stringify(data, null, 2); // Pretty-print with 2 spaces indentation
}