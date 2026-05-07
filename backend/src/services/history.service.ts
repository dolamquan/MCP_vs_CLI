import {
  getComparisonHistoryRecords,
  getComparisonRecordById,
  deleteComparisonRecordById
} from "../database/repositories/comparison.repository";

export const getComparisonHistory = async () => {
  return getComparisonHistoryRecords();
};

export const getComparisonHistoryById = async (id: string) => {
  return getComparisonRecordById(id);
};

export const deleteComparisonHistoryById = async (id: string) => {
  return deleteComparisonRecordById(id);
};

