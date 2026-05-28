import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { getDb } from '../db/lowdb.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  comparePassword,
  hashPassword,
  signToken,
  toPublicUser,
} from '../services/auth.service.js';
import { loginBodySchema, registerBodySchema } from '../schemas.js';
import { conflict, unauthorized } from '../utils/httpError.js';

const router = Router();

router.post(
  '/login',
  validate(loginBodySchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    const db = await getDb();
    const user = db.data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) throw unauthorized('Invalid email or password');
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw unauthorized('Invalid email or password');
    const publicUser = toPublicUser(user);
    res.json({ user: publicUser, token: signToken(publicUser) });
  }),
);

router.post(
  '/register',
  validate(registerBodySchema),
  asyncHandler(async (req, res) => {
    const data = req.body as {
      name: string;
      email: string;
      password: string;
      phone: string;
      role: 'user' | 'agent';
    };
    const db = await getDb();
    const exists = db.data.users.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase(),
    );
    if (exists) throw conflict('Email already registered');
    const passwordHash = await hashPassword(data.password);
    const id = `u${uuid().slice(0, 8)}`;
    const user = {
      id,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name,
      )}&background=random`,
      passwordHash,
    };
    db.data.users.push(user);
    db.data.wishlists.push({ userId: id, propertyIds: [] });
    await db.write();
    const publicUser = toPublicUser(user);
    res.status(201).json({ user: publicUser, token: signToken(publicUser) });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: (req as AuthedRequest).user });
  }),
);

export default router;
