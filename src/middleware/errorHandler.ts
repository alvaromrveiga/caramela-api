import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof ErrorWithStatus) {
    return response.status(error.status).json({ error: error.message });
  }
  return response.status(500).send();
}
