import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { UsersRepository as UsersRepo } from "../controllers/repositories/UsersRepository";

export const validateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (validator.isEmail(req.body.email)) {
    if (await UsersRepo.instance.findOne({ email: req.body.email })) {
      res.status(400).send("Email already in use!");
      return;
    }
    return next();
  } else {
    res.status(400).send("Invalid email");
    return;
  }
};
