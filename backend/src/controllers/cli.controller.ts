import { Request, Response } from "express";
import { runCliCommand } from "../services/cliRunner.service";

export const runCli = async (req: Request, res: Response) => {
  try {
    const { command, mode } = req.body;

    const result = await runCliCommand({
      command,
      mode
    });

    if (!result.safety.isSafe) {
      return res.status(400).json({
        success: false,
        data: result
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to run CLI command."
    });
  }
};