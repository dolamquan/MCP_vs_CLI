import fs from "fs";
import path from "path";

// Utility functions for reading and writing JSON files with error handling and fallback support.
export const readJsonFile = <T>(filePath: string, fallback: T): T => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
      return fallback;
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    if (!raw.trim()) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read JSON file: ${filePath}`, error);
    return fallback;
  }
};

export const writeJsonFile = <T>(filePath: string, data: T): T => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  return data;
};