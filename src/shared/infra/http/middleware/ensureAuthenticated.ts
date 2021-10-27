import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { tokenSecret } from "../../../../config/auth";

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

    res.locals.userId = userId;
    res.locals.token = token;
    // http://expressjs.com/en/api.html#res.locals

    next();
  } catch (error) {
    res.status(401).json({ error: "Please Authenticate" });
  }
};
