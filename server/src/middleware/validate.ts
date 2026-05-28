import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { badRequest } from '../utils/httpError.js';

type Target = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodSchema, target: Target = 'body'): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(
        badRequest('Validation failed', result.error.flatten().fieldErrors),
      );
    }
    // Assign back so coerced values are available downstream.
    (req as any)[target] = result.data;
    next();
  };
