import { NoJwtSecretError } from "../shared/infra/http/middleware/errors/NoJwtSecretError";

if (!process.env.JWT_SECRET) {
  throw new NoJwtSecretError();
}

const tokenExpiresIn = "15m";
const tokenSecret = process.env.JWT_SECRET;

const refreshTokenExpiresIn = "30d";

export { tokenExpiresIn, tokenSecret, refreshTokenExpiresIn };
