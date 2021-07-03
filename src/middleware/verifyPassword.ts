import { NextFunction, Request, Response } from "express";
import { UsersRepository } from "../controllers/repositories/UsersRepository";
import { comparePasswordAsync } from "../utils/bcrypt";

export const verifyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await UsersRepository.instance.findOne({ id: req.body.id });

  if (!user) {
    res.status(401).json({ error: "Please Authenticate" });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({ error: "Invalid password" });
    return;
  }

  const result = await comparePasswordAsync(req.body.password, user.password);

  if (!result) {
    res.status(400).json({ error: "Invalid password" });
    return;
  }

  return next();
};
