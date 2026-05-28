import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  hashPassword,
  comparePassword,
  signToken,
  toPublicUser,
} from './auth.service.js';
import { config } from '../config.js';

describe('hashPassword / comparePassword', () => {
  it('hashes a password to a non-equal string', async () => {
    const hash = await hashPassword('Test123!');
    expect(typeof hash).toBe('string');
    expect(hash).not.toBe('Test123!');
    expect(hash.length).toBeGreaterThan(20);
  });

  it('hash is non-deterministic (salt differs each call)', async () => {
    const a = await hashPassword('Test123!');
    const b = await hashPassword('Test123!');
    expect(a).not.toBe(b);
  });

  it('comparePassword returns true for correct password', async () => {
    const hash = await hashPassword('Test123!');
    expect(await comparePassword('Test123!', hash)).toBe(true);
  });

  it('comparePassword returns false for wrong password', async () => {
    const hash = await hashPassword('Test123!');
    expect(await comparePassword('Wrong!1!', hash)).toBe(false);
  });
});

describe('signToken', () => {
  it('produces a JWT with sub=user.id and role', () => {
    const token = signToken({
      id: 'u1',
      email: 'a@b.com',
      name: 'A',
      role: 'admin',
    });
    const payload = jwt.verify(token, config.jwtSecret) as {
      sub: string;
      role: string;
      exp: number;
    };
    expect(payload.sub).toBe('u1');
    expect(payload.role).toBe('admin');
    expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('produces a token rejected by the wrong secret', () => {
    const token = signToken({ id: 'u1', email: 'a@b.com', name: 'A', role: 'user' });
    expect(() => jwt.verify(token, 'wrong-secret')).toThrow();
  });
});

describe('toPublicUser', () => {
  it('strips passwordHash and preserves other fields', () => {
    const result = toPublicUser({
      id: 'u1',
      email: 'a@b.com',
      name: 'A',
      role: 'user',
      phone: '555',
      avatar: 'http://x',
      passwordHash: 'secret',
    });
    expect(result).toEqual({
      id: 'u1',
      email: 'a@b.com',
      name: 'A',
      role: 'user',
      phone: '555',
      avatar: 'http://x',
    });
    expect((result as Record<string, unknown>).passwordHash).toBeUndefined();
  });

  it('is a no-op for objects already without passwordHash', () => {
    const input = { id: 'u1', email: 'a@b.com', name: 'A', role: 'user' as const };
    expect(toPublicUser(input)).toEqual(input);
  });
});
