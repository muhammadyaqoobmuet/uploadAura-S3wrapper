import type { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { findPackageJSON } from "module";
import { logger } from "../logger/winston.looger";
import { ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error.enum";

export const formatedErrors = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((error) => {
    return {
      feild: error.path.join(" "),
      message: error.message,
    };
  });

  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "validation failed ",
    errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(`error occured at ${req.path} ${error}`);
  logger.error(`error occured ${error}`);
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: "Invalid request body json format , please check request body",
    });
  }

  // handling zod errors
  if (error instanceof ZodError) {
    return formatedErrors(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error?.message || "some error in app",
      errorCode: error?.errorCode,
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    error: error?.message || "unknown error",
  });
};
