import type { RequestHandler } from 'express';
import { isProd } from '../config.js';
import { notFound } from '../utils/httpError.js';

export const notProd: RequestHandler = (_req, _res, next) => {
  if (isProd) return next(notFound());
  next();
};
