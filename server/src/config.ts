import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  dbPath:
    process.env.DB_PATH ??
    path.resolve(__dirname, '..', 'data', 'db.json'),
  seedOnBoot: process.env.SEED_ON_BOOT === 'true',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  defaultSeedPassword: process.env.SEED_PASSWORD ?? 'Test123!',
};

export const isProd = config.nodeEnv === 'production';
