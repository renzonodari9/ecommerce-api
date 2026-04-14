import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendError } from '../types/api.js';
import { HttpStatusCode } from '../config/constants.js';

export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });
        sendError(
          res,
          'Validation failed',
          HttpStatusCode.UNPROCESSABLE_ENTITY,
          errors
        );
        return;
      }
      next(error);
    }
  };
}

export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });
        sendError(
          res,
          'Invalid query parameters',
          HttpStatusCode.BAD_REQUEST,
          errors
        );
        return;
      }
      next(error);
    }
  };
}

export function validateParams<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });
        sendError(
          res,
          'Invalid parameters',
          HttpStatusCode.BAD_REQUEST,
          errors
        );
        return;
      }
      next(error);
    }
  };
}
