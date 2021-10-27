import { AppError } from "../../shared/errors/AppError";

export class NoRefreshTokenSecretError extends AppError {
  constructor() {
    super("No REFRESH_TOKEN_SECRET defined on .env", 500);
  }
}
