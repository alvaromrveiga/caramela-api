import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { tokenSecret } from "../../../../config/auth";
import { UsersRepository } from "../../../../modules/users/infra/typeorm/repositories/UsersRepository";

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

    const { sub: userId } = jwt.verify(token, tokenSecret) as { sub: string };

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(userId);

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
