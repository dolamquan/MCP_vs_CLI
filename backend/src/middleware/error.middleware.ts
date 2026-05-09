import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/status.constant";
import { ERROR_MESSAGES } from "../constants/errors.constant";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  console.error("Error:", {
    message: error.message,
    path: req.originalUrl,
    method: req.method
  });

  return res.status(statusCode).json({
    success: false,
    message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  });
};