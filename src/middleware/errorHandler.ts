import { NextFunction, Request, Response } from "express";
import { KnownError } from "../errors/KnowError";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof KnownError) {
    return response.status(error.status).json({ error: error.message });
  }
  return response.status(500).send();
}
