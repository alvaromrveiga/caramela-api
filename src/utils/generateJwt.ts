import { User } from "../models/User";
import { ErrorWithStatus } from "./ErrorWithStatus";
import jwt from "jsonwebtoken";

export const generateJwt = (user: User) => {
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
