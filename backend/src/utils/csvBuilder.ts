const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const buildCsv = (
  rows: Record<string, unknown>[]
): string => {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);

  const csvRows = [
    headers.join(","),
    ...rows.map((row) => {
      return headers
        .map((header) => escapeCsvValue(row[header]))
        .join(",");
    })
  ];

  return csvRows.join("\n");
};