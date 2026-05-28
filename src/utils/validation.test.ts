import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './validation';

describe('loginSchema', () => {
  it('accepts a valid pair', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'secret1' }).success).toBe(true);
  });

  it('rejects a too-short password (< 6 chars)', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '12345' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'bogus', password: 'secret1' }).success).toBe(false);
  });
});

describe('registerSchema', () => {
  const base = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Strong1!',
    confirmPassword: 'Strong1!',
    phone: '5551112222',
    role: 'user' as const,
  };

  it('accepts a fully valid payload', () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it('rejects when confirmPassword does not match', () => {
    const r = registerSchema.safeParse({ ...base, confirmPassword: 'Different1!' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('confirmPassword');
    }
  });

  it.each([
    ['no uppercase', 'strong1!'],
    ['no digit', 'Strongg!'],
    ['no special', 'Strong11'],
    ['too short', 'Aa1!'],
  ])('rejects password: %s', (_label, password) => {
    const r = registerSchema.safeParse({ ...base, password, confirmPassword: password });
    expect(r.success).toBe(false);
  });

  it('rejects role outside the user|agent enum', () => {
    expect(
      registerSchema.safeParse({ ...base, role: 'admin' as never }).success,
    ).toBe(false);
  });

  it('rejects a short phone', () => {
    expect(registerSchema.safeParse({ ...base, phone: '12345' }).success).toBe(false);
  });

  it('rejects a name shorter than 2 chars', () => {
    expect(registerSchema.safeParse({ ...base, name: 'X' }).success).toBe(false);
  });
});
