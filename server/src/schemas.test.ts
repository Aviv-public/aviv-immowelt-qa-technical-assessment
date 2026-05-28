import { describe, it, expect } from 'vitest';
import {
  loginBodySchema,
  registerBodySchema,
  createPropertyBodySchema,
  propertyQuerySchema,
  updateMeBodySchema,
  contactMessageBodySchema,
} from './schemas.js';

describe('loginBodySchema', () => {
  it('accepts a valid email + non-empty password', () => {
    const r = loginBodySchema.safeParse({ email: 'a@b.com', password: 'x' });
    expect(r.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const r = loginBodySchema.safeParse({ email: 'nope', password: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejects an empty password', () => {
    expect(loginBodySchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });
});

describe('registerBodySchema', () => {
  const base = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Strong1!',
    phone: '5551112222',
    role: 'user' as const,
  };

  it('accepts a fully-valid payload', () => {
    expect(registerBodySchema.safeParse(base).success).toBe(true);
  });

  it('defaults role to "user" when omitted', () => {
    const r = registerBodySchema.safeParse({ ...base, role: undefined });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.role).toBe('user');
  });

  it('rejects role=admin (admin is seed-only)', () => {
    const r = registerBodySchema.safeParse({ ...base, role: 'admin' });
    expect(r.success).toBe(false);
  });

  it.each([
    ['too short', 'Aa1!'],
    ['no uppercase', 'strong1!'],
    ['no digit', 'Strongg!'],
    ['no special', 'Strong11'],
  ])('rejects password: %s', (_label, password) => {
    const r = registerBodySchema.safeParse({ ...base, password });
    expect(r.success).toBe(false);
  });

  it('rejects a short phone number', () => {
    expect(registerBodySchema.safeParse({ ...base, phone: '12345' }).success).toBe(false);
  });
});

describe('createPropertyBodySchema', () => {
  const base = {
    title: 'A Title',
    description: 'A long enough description',
    price: 500_000,
    location: { address: '1 St', city: 'LA', state: 'CA', zipCode: '90000' },
    features: { bedrooms: 2, bathrooms: 1, area: 1000, yearBuilt: 2020 },
    type: 'sale' as const,
    images: [],
  };

  it('accepts a valid body and defaults status to "available"', () => {
    const r = createPropertyBodySchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.status).toBe('available');
  });

  it('coerces numeric strings in features and price', () => {
    const r = createPropertyBodySchema.safeParse({
      ...base,
      price: '500000',
      features: { bedrooms: '3', bathrooms: '2.5', area: '1500', yearBuilt: '2019' },
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.price).toBe(500_000);
      expect(r.data.features.bedrooms).toBe(3);
      expect(r.data.features.bathrooms).toBe(2.5);
    }
  });

  it('rejects negative price', () => {
    expect(createPropertyBodySchema.safeParse({ ...base, price: -1 }).success).toBe(false);
  });

  it('rejects unknown property type', () => {
    expect(
      createPropertyBodySchema.safeParse({ ...base, type: 'lease' as never }).success,
    ).toBe(false);
  });
});

describe('propertyQuerySchema', () => {
  it('coerces numeric query string params', () => {
    const r = propertyQuerySchema.safeParse({ minPrice: '100', bedrooms: '3' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.minPrice).toBe(100);
      expect(r.data.bedrooms).toBe(3);
    }
  });

  it('rejects unknown sort values', () => {
    expect(propertyQuerySchema.safeParse({ sort: 'random' }).success).toBe(false);
  });

  it('accepts a fully empty query', () => {
    expect(propertyQuerySchema.safeParse({}).success).toBe(true);
  });
});

describe('updateMeBodySchema', () => {
  it('accepts a profile-only update', () => {
    expect(
      updateMeBodySchema.safeParse({ name: 'New Name', phone: '5551234567' }).success,
    ).toBe(true);
  });

  it('rejects newPassword without currentPassword', () => {
    expect(
      updateMeBodySchema.safeParse({ newPassword: 'Strong1!' }).success,
    ).toBe(false);
  });

  it('rejects currentPassword without newPassword', () => {
    expect(
      updateMeBodySchema.safeParse({ currentPassword: 'old' }).success,
    ).toBe(false);
  });

  it('accepts both passwords together (strong newPassword)', () => {
    expect(
      updateMeBodySchema.safeParse({
        currentPassword: 'oldpw',
        newPassword: 'Strong1!',
      }).success,
    ).toBe(true);
  });
});

describe('contactMessageBodySchema', () => {
  it('accepts a typical message', () => {
    expect(
      contactMessageBodySchema.safeParse({
        name: 'Buyer',
        email: 'buyer@example.com',
        message: 'I am interested in this property!',
      }).success,
    ).toBe(true);
  });

  it('rejects a too-short message', () => {
    expect(
      contactMessageBodySchema.safeParse({
        name: 'Buyer',
        email: 'b@b.com',
        message: 'short',
      }).success,
    ).toBe(false);
  });
});
