import { AppError, ErrorContext } from "./AppError";

export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext, cause?: unknown) {
    super({
      message,
      code: "DATABASE_ERROR",
      statusCode: 500,
      context,
      cause,
    });
  }
}
