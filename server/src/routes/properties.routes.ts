import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { getDb } from '../db/lowdb.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createPropertyBodySchema,
  propertyQuerySchema,
  updatePropertyBodySchema,
} from '../schemas.js';
import { filterAndSort } from '../services/properties.service.js';
import { forbidden, notFound } from '../utils/httpError.js';

const router = Router();

router.get(
  '/',
  validate(propertyQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const q = req.query as any;
    res.json(filterAndSort(db.data.properties, q));
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const property = db.data.properties.find((p) => p.id === req.params.id);
    if (!property) throw notFound('Property not found');
    res.json(property);
  }),
);

router.post(
  '/',
  requireAuth,
  requireRole('agent', 'admin'),
  validate(createPropertyBodySchema),
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const user = (req as AuthedRequest).user;
    // Pick an agent record for the property card.
    const agent =
      db.data.agents.find((a) => a.email === user.email) ?? {
        id: user.id,
        name: user.name,
        phone: user.phone ?? '',
        email: user.email,
      };
    const now = new Date().toISOString();
    const property = {
      id: `p${uuid().slice(0, 8)}`,
      ...(req.body as any),
      agent: {
        id: agent.id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
      },
      createdAt: now,
      updatedAt: now,
    };
    db.data.properties.unshift(property);
    await db.write();
    res.status(201).json(property);
  }),
);

router.put(
  '/:id',
  requireAuth,
  validate(updatePropertyBodySchema),
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const user = (req as AuthedRequest).user;
    const idx = db.data.properties.findIndex((p) => p.id === req.params.id);
    if (idx === -1) throw notFound('Property not found');
    const current = db.data.properties[idx];
    if (user.role !== 'admin' && current.agent.email !== user.email) {
      throw forbidden('You can only edit your own listings');
    }
    const updated = {
      ...current,
      ...(req.body as any),
      id: current.id,
      agent: current.agent,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    db.data.properties[idx] = updated;
    await db.write();
    res.json(updated);
  }),
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const user = (req as AuthedRequest).user;
    const idx = db.data.properties.findIndex((p) => p.id === req.params.id);
    if (idx === -1) throw notFound('Property not found');
    const current = db.data.properties[idx];
    if (user.role !== 'admin' && current.agent.email !== user.email) {
      throw forbidden('You can only delete your own listings');
    }
    db.data.properties.splice(idx, 1);
    // Cascade: remove from any wishlists.
    db.data.wishlists = db.data.wishlists.map((w) => ({
      ...w,
      propertyIds: w.propertyIds.filter((pid) => pid !== current.id),
    }));
    await db.write();
    res.status(204).send();
  }),
);

export default router;
