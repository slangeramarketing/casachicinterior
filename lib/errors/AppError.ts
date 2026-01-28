// lib/errors/AppError.ts

export type ErrorContext = Record<string, any>;

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: ErrorContext;
  public readonly isOperational: boolean;

  constructor(options: {
    message: string;
    code?: string;
    statusCode?: number;
    context?: ErrorContext;
    cause?: unknown;
  }) {
    super(options.message);

    this.name = this.constructor.name;
    this.code = options.code ?? "APP_ERROR";
    this.statusCode = options.statusCode ?? 500;
    this.context = options.context;
    this.isOperational = true;

    if (options.cause) {
      // Node 18+ supports error cause
      (this as any).cause = options.cause;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
