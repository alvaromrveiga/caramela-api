import { NextFunction, Request, Response } from "express";

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const minLength = 8;

  if (req.body.password.length < minLength) {
    res.status(400).send(`Password shorter than ${minLength} characters`);
    return;
  }
  next();
  return;
};
