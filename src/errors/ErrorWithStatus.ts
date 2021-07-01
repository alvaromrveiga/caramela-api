export class ErrorWithStatus extends Error {
  constructor(public status: number, message: string) {
    super(message);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ErrorWithStatus.prototype);
  }
}
