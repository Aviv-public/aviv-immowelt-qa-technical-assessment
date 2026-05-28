import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { getDb } from '../db/lowdb.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth, type AuthedRequest } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { contactMessageBodySchema } from '../schemas.js';
import { notFound } from '../utils/httpError.js';

const router = Router();

router.post(
  '/:agentId/messages',
  optionalAuth,
  validate(contactMessageBodySchema),
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const agent = db.data.agents.find((a) => a.id === req.params.agentId);
    if (!agent) throw notFound('Agent not found');
    const body = req.body as {
      name: string;
      email: string;
      phone?: string;
      message: string;
    };
    const message = {
      id: `m${uuid().slice(0, 8)}`,
      agentId: agent.id,
      fromUserId: (req as AuthedRequest).user?.id ?? null,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      createdAt: new Date().toISOString(),
    };
    db.data.messages.push(message);
    await db.write();
    res.status(201).json(message);
  }),
);

export default router;
