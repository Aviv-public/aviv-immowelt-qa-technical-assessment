import fs from 'node:fs';
import path from 'node:path';
import { JSONFilePreset } from 'lowdb/node';
import { config } from '../config.js';
import { buildSeed } from './seed.js';
import type { DbSchema } from '../types/domain.js';

let dbInstance: Awaited<ReturnType<typeof JSONFilePreset<DbSchema>>> | null =
  null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const dir = path.dirname(config.dbPath);
  fs.mkdirSync(dir, { recursive: true });

  const needsSeed = config.seedOnBoot || !fs.existsSync(config.dbPath);

  dbInstance = await JSONFilePreset<DbSchema>(config.dbPath, buildSeed());

  if (needsSeed) {
    dbInstance.data = buildSeed();
    await dbInstance.write();
  }
  return dbInstance;
}

export async function resetDb() {
  const db = await getDb();
  db.data = buildSeed();
  await db.write();
  return db.data;
}
