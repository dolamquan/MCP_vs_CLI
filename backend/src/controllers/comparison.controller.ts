import { Request, Response } from "express";
import { compareCommands } from "../services/comparison.service";
import { createComparisonRecord } from "../database/repositories/comparison.repository";

export const createComparison = async (req: Request, res: Response) => {
    try {
        const { cliCommand, mcpCommand, modelId } = req.body;

        const result = compareCommands({
            cliCommand,
            mcpCommand,
            modelId
        });

        const savedComparison = await createComparisonRecord(result);

        return res.status(201).json({
        success: true,
        data: {
            comparison: result,
            savedRecord: savedComparison
        }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create comparison."
        });
    }
};