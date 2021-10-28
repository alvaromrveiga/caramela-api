import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("Invalid refresh token!");
  }
}
