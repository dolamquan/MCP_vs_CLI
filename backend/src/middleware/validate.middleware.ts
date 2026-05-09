import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/status.constant";
import { ERROR_MESSAGES } from "../constants/errors.constant";

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

type ValidatorFunction = (body: unknown) => ValidationResult;

export const validateBody =
  (validator: ValidatorFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = validator(req.body);

    if (!result.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: result.message || ERROR_MESSAGES.VALIDATION_FAILED
      });
    }

    next();
  };