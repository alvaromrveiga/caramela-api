import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { UsersRepository as UsersRepo } from "../controllers/UsersRepository";

export const validateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (validator.isEmail(req.body.email)) {
    if (await UsersRepo.instance().findOne({ email: req.body.email })) {
      return res.status(400).send("Email already in use!");
    }
    return next();
  } else {
    return res.status(400).send("Invalid email");
  }
};
