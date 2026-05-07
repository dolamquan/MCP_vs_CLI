import { prisma } from "../db";

export const getPricingModelsFromDatabase = async () => {
  return prisma.pricingModel.findMany({
    orderBy: {
      modelName: "asc"
    }
  });
};

export const getPricingModelByModelIdFromDatabase = async (
  modelId: string
) => {
  return prisma.pricingModel.findUnique({
    where: {
      modelId
    }
  });
};