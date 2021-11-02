import { AppError } from "./AppError";

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("Invalid refresh token!");
  }
}
