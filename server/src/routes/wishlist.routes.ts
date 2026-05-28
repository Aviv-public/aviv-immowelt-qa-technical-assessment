import { Router } from 'express';
import { getDb } from '../db/lowdb.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../utils/httpError.js';

const router = Router();

function getEntry(db: Awaited<ReturnType<typeof getDb>>, userId: string) {
  let entry = db.data.wishlists.find((w) => w.userId === userId);
  if (!entry) {
    entry = { userId, propertyIds: [] };
    db.data.wishlists.push(entry);
  }
  return entry;
}

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const user = (req as AuthedRequest).user;
    const entry = getEntry(db, user.id);
    const properties = entry.propertyIds
      .map((id) => db.data.properties.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    res.json(properties);
  }),
);

router.post(
  '/:propertyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const user = (req as AuthedRequest).user;
    const property = db.data.properties.find(
      (p) => p.id === req.params.propertyId,
    );
    if (!property) throw notFound('Property not found');
    const entry = getEntry(db, user.id);
    if (!entry.propertyIds.includes(property.id)) {
      entry.propertyIds.push(property.id);
      await db.write();
    }
    res.status(201).json({ propertyIds: entry.propertyIds });
  }),
);

router.delete(
  '/:propertyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const user = (req as AuthedRequest).user;
    const entry = getEntry(db, user.id);
    entry.propertyIds = entry.propertyIds.filter(
      (id) => id !== req.params.propertyId,
    );
    await db.write();
    res.json({ propertyIds: entry.propertyIds });
  }),
);

export default router;
