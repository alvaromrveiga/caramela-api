import { NoJwtSecretError } from "./errors/NoJwtSecretError";
import { NoRefreshTokenSecretError } from "./errors/NoRefreshTokenSecretError";

if (!process.env.JWT_SECRET) {
  throw new NoJwtSecretError();
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new NoRefreshTokenSecretError();
}

if (!process.env.RESET_PASSWORD_TOKEN_SECRET) {
  throw new NoRefreshTokenSecretError();
}

const tokenExpiresIn = "30m";
const tokenSecret = process.env.JWT_SECRET;

const refreshTokenExpiresInDays = 30;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const resetPasswordTokenSecret = process.env.RESET_PASSWORD_TOKEN_SECRET;
const resetPasswordTokenExpiresInHours = 3;

export {
  tokenExpiresIn,
  tokenSecret,
  refreshTokenExpiresInDays,
  refreshTokenSecret,
  resetPasswordTokenSecret,
  resetPasswordTokenExpiresInHours,
};
