-- CreateTable
CREATE TABLE "Comparison" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cliCommand" TEXT NOT NULL,
    "mcpCommand" TEXT NOT NULL,
    "cliTokens" INTEGER NOT NULL,
    "mcpTokens" INTEGER NOT NULL,
    "tokenDifference" INTEGER NOT NULL,
    "cliInputCost" REAL NOT NULL,
    "cliOutputCost" REAL NOT NULL,
    "cliTotalCost" REAL NOT NULL,
    "mcpInputCost" REAL NOT NULL,
    "mcpOutputCost" REAL NOT NULL,
    "mcpTotalCost" REAL NOT NULL,
    "costDifference" REAL NOT NULL,
    "amountSaved" REAL NOT NULL,
    "percentageSaved" REAL NOT NULL,
    "recommendedOption" TEXT NOT NULL,
    "recommendationReason" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PricingModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "inputCostPer1MTokens" REAL NOT NULL,
    "outputCostPer1MTokens" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingModel_modelId_key" ON "PricingModel"("modelId");
