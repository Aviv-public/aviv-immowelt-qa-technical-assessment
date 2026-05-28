import { z } from 'zod';

// Reuse the registration password rule from the frontend.
const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character');

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: strongPassword,
  phone: z.string().min(10),
  role: z.enum(['user', 'agent']).default('user'),
});

export const propertyLocationSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
});

export const propertyFeaturesSchema = z.object({
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().min(0),
  yearBuilt: z.coerce.number().int().min(1800),
});

export const createPropertyBodySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  location: propertyLocationSchema,
  features: propertyFeaturesSchema,
  type: z.enum(['sale', 'rent', 'commercial']),
  status: z.enum(['available', 'sold', 'under-contract']).default('available'),
  images: z.array(z.string()).default([]),
});

export const updatePropertyBodySchema = createPropertyBodySchema.partial();

export const propertyQuerySchema = z.object({
  type: z.enum(['sale', 'rent', 'commercial']).optional(),
  status: z.enum(['available', 'sold', 'under-contract']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().optional(),
  location: z.string().optional(),
  q: z.string().optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'oldest'])
    .optional(),
});

export const updateMeBodySchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    avatar: z.string().url().optional(),
    currentPassword: z.string().optional(),
    newPassword: strongPassword.optional(),
  })
  .refine(
    (d) =>
      (!d.currentPassword && !d.newPassword) ||
      (d.currentPassword && d.newPassword),
    {
      message: 'currentPassword and newPassword must be provided together',
      path: ['newPassword'],
    },
  );

export const adminUpdateUserBodySchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  role: z.enum(['user', 'agent', 'admin']).optional(),
  avatar: z.string().url().optional(),
});

export const contactMessageBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  message: z.string().min(10),
});
