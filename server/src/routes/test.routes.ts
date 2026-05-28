import { Router } from 'express';
import { resetDb } from '../db/lowdb.js';
import { notProd } from '../middleware/notProd.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/reset',
  notProd,
  asyncHandler(async (_req, res) => {
    await resetDb();
    res.json({ ok: true, message: 'Database reset to seed' });
  }),
);

export default router;
