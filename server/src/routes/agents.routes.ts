import { Router } from 'express';
import { getDb } from '../db/lowdb.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notFound } from '../utils/httpError.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const { q, specialization, location } = req.query as Record<
      string,
      string | undefined
    >;
    let agents = db.data.agents;
    if (q) {
      const needle = q.toLowerCase();
      agents = agents.filter(
        (a) =>
          a.name.toLowerCase().includes(needle) ||
          a.bio.toLowerCase().includes(needle),
      );
    }
    if (specialization) {
      const needle = specialization.toLowerCase();
      agents = agents.filter((a) =>
        a.specialization.toLowerCase().includes(needle),
      );
    }
    if (location) {
      const needle = location.toLowerCase();
      agents = agents.filter((a) => a.location.toLowerCase().includes(needle));
    }
    res.json(agents);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = await getDb();
    const agent = db.data.agents.find((a) => a.id === req.params.id);
    if (!agent) throw notFound('Agent not found');
    res.json(agent);
  }),
);

export default router;
