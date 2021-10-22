export class AppError extends Error {
  readonly message: string;
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
