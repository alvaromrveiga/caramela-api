import { NoJwtSecretError } from "./errors/NoJwtSecretError";
import { NoRefreshTokenSecretError } from "./errors/NoRefreshTokenSecretError";

if (!process.env.JWT_SECRET) {
  throw new NoJwtSecretError();
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new NoRefreshTokenSecretError();
}

const tokenExpiresIn = "15m";
const tokenSecret = process.env.JWT_SECRET;

const refreshTokenExpiresInDays = 180;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const resetPasswordTokenExpiresInHours = 3;

export {
  tokenExpiresIn,
  tokenSecret,
  refreshTokenExpiresInDays,
  refreshTokenSecret,
  resetPasswordTokenExpiresInHours,
};
