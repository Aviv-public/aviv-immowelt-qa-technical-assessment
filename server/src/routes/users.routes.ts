import { Router } from 'express';
import { getDb } from '../db/lowdb.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  adminUpdateUserBodySchema,
  updateMeBodySchema,
} from '../schemas.js';
import {
  comparePassword,
  hashPassword,
  signToken,
  toPublicUser,
} from '../services/auth.service.js';
import { badRequest, conflict, notFound, unauthorized } from '../utils/httpError.js';

const router = Router();

// PUT /me must be declared before "/:id" so the literal segment wins.
router.put(
  '/me',
  requireAuth,
  validate(updateMeBodySchema),
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const me = (req as AuthedRequest).user;
    const idx = db.data.users.findIndex((u) => u.id === me.id);
    if (idx === -1) throw notFound('User not found');
    const current = db.data.users[idx];
    const body = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      avatar?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    if (
      body.email &&
      body.email.toLowerCase() !== current.email.toLowerCase()
    ) {
      const taken = db.data.users.some(
        (u) =>
          u.id !== current.id &&
          u.email.toLowerCase() === body.email!.toLowerCase(),
      );
      if (taken) throw conflict('Email already registered');
    }

    let passwordHash = current.passwordHash;
    if (body.newPassword) {
      const ok = await comparePassword(
        body.currentPassword!,
        current.passwordHash,
      );
      if (!ok) throw unauthorized('Current password is incorrect');
      passwordHash = await hashPassword(body.newPassword);
    }

    const updated = {
      ...current,
      name: body.name ?? current.name,
      email: body.email ?? current.email,
      phone: body.phone ?? current.phone,
      avatar: body.avatar ?? current.avatar,
      passwordHash,
    };
    db.data.users[idx] = updated;
    await db.write();
    const publicUser = toPublicUser(updated);
    // Re-issue token because the JWT payload encodes the user id (and could
    // include name/email if a consumer caches it).
    res.json({ user: publicUser, token: signToken(publicUser) });
  }),
);

router.get(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (_req, res) => {
    const db = await getDb();
    res.json(db.data.users.map(toPublicUser));
  }),
);

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  validate(adminUpdateUserBodySchema),
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const idx = db.data.users.findIndex((u) => u.id === req.params.id);
    if (idx === -1) throw notFound('User not found');
    const current = db.data.users[idx];
    const body = req.body as Record<string, unknown>;
    if (typeof body.email === 'string' && body.email !== current.email) {
      const taken = db.data.users.some(
        (u) =>
          u.id !== current.id &&
          u.email.toLowerCase() === (body.email as string).toLowerCase(),
      );
      if (taken) throw conflict('Email already registered');
    }
    const updated = { ...current, ...body } as typeof current;
    db.data.users[idx] = updated;
    await db.write();
    res.json(toPublicUser(updated));
  }),
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const me = (req as AuthedRequest).user;
    if (me.id === req.params.id) throw badRequest('Cannot delete yourself');
    const before = db.data.users.length;
    db.data.users = db.data.users.filter((u) => u.id !== req.params.id);
    if (db.data.users.length === before) throw notFound('User not found');
    db.data.wishlists = db.data.wishlists.filter(
      (w) => w.userId !== req.params.id,
    );
    await db.write();
    res.status(204).send();
  }),
);

export default router;
