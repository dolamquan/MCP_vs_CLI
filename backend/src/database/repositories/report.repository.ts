import { prisma } from "../db";

export const getAllComparisonRecordsForReports = async () => {
  return prisma.comparison.findMany({
    orderBy: {
      createdAt: "asc"
    }
  });
};

export const getTotalComparisonCount = async () => {
  return prisma.comparison.count();
};
