import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { getDb } from '../db/lowdb.js';
import { unauthorized } from '../utils/httpError.js';
import type { PublicUser } from '../types/domain.js';

export interface AuthedRequest extends Request {
  user: PublicUser;
}

interface TokenPayload {
  sub: string;
  role: PublicUser['role'];
}

export const optionalAuth: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
    const db = await getDb();
    const user = db.data.users.find((u) => u.id === payload.sub);
    if (user) {
      const { passwordHash: _ph, ...publicUser } = user;
      (req as AuthedRequest).user = publicUser;
    }
    next();
  } catch {
    next();
  }
};

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(unauthorized('Missing bearer token'));
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
    const db = await getDb();
    const user = db.data.users.find((u) => u.id === payload.sub);
    if (!user) return next(unauthorized('User no longer exists'));
    const { passwordHash: _ph, ...publicUser } = user;
    (req as AuthedRequest).user = publicUser;
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
};
