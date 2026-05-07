import { Request, Response } from "express";
import { getReportSummary } from "../services/reports.service";
import { getChartData } from "../services/chartData.service";

export const getSummaryReport = async (req: Request, res: Response) => {
  try {
    const summary = await getReportSummary();

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get summary report."
    });
  }
};

export const getReportChartData = async (req: Request, res: Response) => {
  try {
    const chartData = await getChartData();

    return res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get report chart data."
    });
  }
};
