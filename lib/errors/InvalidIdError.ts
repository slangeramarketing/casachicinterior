import { AppError, ErrorContext } from "./AppError";

export class InvalidIdError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      message,
      code: "INVALID_ID",
      statusCode: 400,
      context,
    });
  }
}
