import type { RequestHandler } from 'express';
import { forbidden, unauthorized } from '../utils/httpError.js';
import type { AuthedRequest } from './auth.js';
import type { PublicUser } from '../types/domain.js';

export const requireRole =
  (...roles: PublicUser['role'][]): RequestHandler =>
  (req, _res, next) => {
    const user = (req as AuthedRequest).user;
    if (!user) return next(unauthorized());
    if (!roles.includes(user.role)) return next(forbidden());
    next();
  };
