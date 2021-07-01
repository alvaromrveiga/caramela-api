import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UsersRepository } from "../controllers/repositories/UsersRepository";
import { User } from "../models/User";
import { ErrorWithStatus } from "../utils/ErrorWithStatus";

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}

export const authenticate = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Please Authenticate" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new ErrorWithStatus(500, "No JWT_SECRET defined on .env");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const user = await UsersRepository.instance.findOne({ id: decoded.id });

    if (!user) {
      res.status(401).json({ error: "Please Authenticate" });
      return;
    }

    req.body.id = user.id;

    next();
    return;
  } catch (error) {
    res.status(401).json({ error: "Please Authenticate" });
    return;
  }
};

export const generateAuthToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new ErrorWithStatus(500, "No JWT_SECRET defined on .env");
  }

  if (!user.id) {
    throw new ErrorWithStatus(500, "No user.id");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  if (!user.tokens) {
    user.tokens = [];
  }
  user.tokens = user.tokens.concat(token);
};
