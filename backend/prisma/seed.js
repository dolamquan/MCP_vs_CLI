"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const client_1 = require("@prisma/client");
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db"
});
const prisma = new client_1.PrismaClient({ adapter });
const pricingModels = [
    {
        modelId: "gpt-4.1",
        modelName: "GPT-4.1",
        provider: "OpenAI",
        inputCostPer1MTokens: 2.0,
        outputCostPer1MTokens: 8.0
    },
    {
        modelId: "gpt-4.1-mini",
        modelName: "GPT-4.1 Mini",
        provider: "OpenAI",
        inputCostPer1MTokens: 0.4,
        outputCostPer1MTokens: 1.6
    },
    {
        modelId: "claude-sonnet",
        modelName: "Claude Sonnet",
        provider: "Anthropic",
        inputCostPer1MTokens: 3.0,
        outputCostPer1MTokens: 15.0
    },
    {
        modelId: "claude-haiku",
        modelName: "Claude Haiku",
        provider: "Anthropic",
        inputCostPer1MTokens: 0.8,
        outputCostPer1MTokens: 4.0
    },
    {
        modelId: "gemini-pro",
        modelName: "Gemini Pro",
        provider: "Google",
        inputCostPer1MTokens: 1.25,
        outputCostPer1MTokens: 5.0
    }
];
async function main() {
    for (const model of pricingModels) {
        await prisma.pricingModel.upsert({
            where: {
                modelId: model.modelId
            },
            update: model,
            create: model
        });
    }
    console.log("Pricing models seeded.");
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
