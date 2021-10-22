import jwt from "jsonwebtoken";

import { User } from "../modules/users/infra/typeorm/entities/User";
import { NoJwtSecretError } from "../shared/infra/http/middleware/errors/NoJwtSecretError";

export const generateJwt = (user: User): void => {
  if (!process.env.JWT_SECRET) {
    throw new NoJwtSecretError();
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  const userReference = user;

  if (!user.tokens) {
    userReference.tokens = [];
  }
  userReference.tokens = user.tokens.concat(token);
};
