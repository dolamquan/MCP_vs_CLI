import { Request, Response } from "express";
import {
  exportHistoryAsCsv,
  exportHistoryAsJson
} from "../services/export.service";

export const exportHistoryJson = async (
  req: Request,
  res: Response
) => {
  try {
    const jsonData = await exportHistoryAsJson();

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=comparison-history.json"
    );

    return res.status(200).send(jsonData);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export history as JSON."
    });
  }
};

export const exportHistoryCsv = async (
  req: Request,
  res: Response
) => {
  try {
    const csvData = await exportHistoryAsCsv();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=comparison-history.csv"
    );

    return res.status(200).send(csvData);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export history as CSV."
    });
  }
};