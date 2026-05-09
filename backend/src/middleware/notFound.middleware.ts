import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/status.constant";
import { ERROR_MESSAGES } from "../constants/errors.constant";

export const notFoundMiddleware = (req: Request, res: Response) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: ERROR_MESSAGES.ROUTE_NOT_FOUND,
    path: req.originalUrl
  });
};