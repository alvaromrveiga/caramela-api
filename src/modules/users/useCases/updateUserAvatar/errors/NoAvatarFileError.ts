import { AppError } from "../../../../../shared/errors/AppError";

export class NoAvatarFileError extends AppError {
  constructor() {
    super("Please upload an avatar file");
  }
}
