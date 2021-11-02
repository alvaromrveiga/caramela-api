import { AppError } from "../../shared/errors/AppError";

export class NoResetPasswordTokenSecretError extends AppError {
  constructor() {
    super("No RESET_PASSWORD_TOKEN_SECRET defined on .env", 500);
  }
}
