import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

import { AppError } from "../../../errors/AppError";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof MulterError) {
    return response
      .status(400)
      .json({ error: `File upload error: ${error.message}` });
  }

  return response.status(500).json({ error: error.message });
}
