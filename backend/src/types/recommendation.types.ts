export type RecommendationOption = "CLI" | "MCP" | "Equal";

export interface RecommendationInput {
    clitokens: number;
    mcptokens: number;
    cliCost: number;
    mcpCost: number;
}

export interface RecommendationResult {
    recommendedOption: RecommendationOption;
    reason: string;
}