import jwt from "jsonwebtoken";

import { User } from "../modules/users/infra/typeorm/entities/User";
import { ErrorWithStatus } from "./ErrorWithStatus";

export const generateJwt = (user: User): void => {
  if (!process.env.JWT_SECRET) {
    throw new ErrorWithStatus(500, "No JWT_SECRET defined on .env");
  }

  if (!user.id) {
    throw new ErrorWithStatus(500, "No user.id");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  const userReference = user;

  if (!user.tokens) {
    userReference.tokens = [];
  }
  userReference.tokens = user.tokens.concat(token);
};
