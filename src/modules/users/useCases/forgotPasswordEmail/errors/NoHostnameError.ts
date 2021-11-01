import { AppError } from "../../../../../shared/errors/AppError";

export class NoHostnameError extends AppError {
  constructor() {
    super("No hostname received from request headers", 500);
  }
}
