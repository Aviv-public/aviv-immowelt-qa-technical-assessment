import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../utils/httpError.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  // eslint-disable-next-line no-console
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'Internal server error' });
};

export const notFoundHandler = (_req: any, res: any) => {
  res.status(404).json({ error: 'Route not found' });
};
