import { AppError } from "../../../../errors/AppError";

export class FileTypeError extends AppError {
  constructor(fileTypes: RegExp) {
    super(`File upload only supports the following filetypes - ${fileTypes}`);
  }
}
