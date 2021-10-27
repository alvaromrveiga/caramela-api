import { AppError } from "../../shared/errors/AppError";

export class NoJwtSecretError extends AppError {
  constructor() {
    super("No JWT_SECRET defined on .env", 500);
  }
}
