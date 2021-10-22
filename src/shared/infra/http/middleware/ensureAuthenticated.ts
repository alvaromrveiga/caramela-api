import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UsersRepository } from "../../../../modules/users/infra/typeorm/repositories/UsersRepository";
import { NoJwtSecretError } from "./errors/NoJwtSecretError";

export const ensureAuthenticated = async (
  req: Request,
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
      throw new NoJwtSecretError();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(decoded.id);

    if (!user) {
      res.status(401).json({ error: "Please Authenticate" });
      return;
    }

    if (!isTokenValid(user.tokens, token)) {
      res.status(401).json({ error: "Please Authenticate" });
      return;
    }

    res.locals.userId = user.id;
    res.locals.token = token;
    // http://expressjs.com/en/api.html#res.locals

    next();
  } catch (error) {
    res.status(401).json({ error: "Please Authenticate" });
  }
};

const isTokenValid = (tokens: string[], thisToken: string) => {
  return tokens.find((token) => token === thisToken);
};
