import { Request, Response } from "express";
import {
  getComparisonHistory,
  getComparisonHistoryById,
  deleteComparisonHistoryById
} from "../services/history.service";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await getComparisonHistory();

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get comparison history."
    });
  }
};

export const getHistoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const historyItem = await getComparisonHistoryById(id);

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: "Comparison history item not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: historyItem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get comparison history item."
    });
  }
};

export const deleteHistoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const historyItem = await getComparisonHistoryById(id);

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: "Comparison history item not found."
      });
    }

    await deleteComparisonHistoryById(id);

    return res.status(200).json({
      success: true,
      message: "Comparison history item deleted."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete comparison history item."
    });
  }
};