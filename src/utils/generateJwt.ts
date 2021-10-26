import jwt from "jsonwebtoken";

import { tokenExpiresIn, tokenSecret } from "../config/auth";
import { User } from "../modules/users/infra/typeorm/entities/User";

export const generateJwt = (user: User): void => {
  const token = jwt.sign({}, tokenSecret, {
    subject: user.id,
    expiresIn: tokenExpiresIn,
  });

  const userReference = user;

  if (!user.tokens) {
    userReference.tokens = [];
  }
  userReference.tokens = user.tokens.concat(token);
};
