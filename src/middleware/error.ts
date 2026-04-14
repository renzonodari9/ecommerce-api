import { Request, Response, NextFunction } from 'express';
import { sendError } from '../types/api.js';
import { HttpStatusCode } from '../config/constants.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  console.error('Unhandled Error:', err);

  sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
    HttpStatusCode.INTERNAL_SERVER_ERROR
  );
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.originalUrl} not found`, HttpStatusCode.NOT_FOUND);
}
