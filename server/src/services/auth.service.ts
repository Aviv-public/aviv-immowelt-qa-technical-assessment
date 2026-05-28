import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config.js';
import type { PublicUser } from '../types/domain.js';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signToken = (user: PublicUser) =>
  jwt.sign(
    { sub: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn } as SignOptions,
  );

export const toPublicUser = <T extends PublicUser & { passwordHash?: string }>(
  u: T,
): PublicUser => {
  const { passwordHash: _ph, ...rest } = u as PublicUser & {
    passwordHash?: string;
  };
  return rest;
};
