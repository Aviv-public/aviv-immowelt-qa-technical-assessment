import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { config } from './config.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/properties.routes.js';
import agentRoutes from './routes/agents.routes.js';
import userRoutes from './routes/users.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import messageRoutes from './routes/messages.routes.js';
import testRoutes from './routes/test.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  app.use(cors({ origin: config.webOrigin, credentials: true }));
  app.use(express.json({ limit: '5mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, env: config.nodeEnv });
  });

  // Friendly index — when a human types the bare host or /api into a browser.
  const indexPayload = {
    name: 'Real Estate API',
    docs: '/api/docs',
    spec: '/api/openapi.json',
    health: '/api/health',
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET  /api/auth/me',
      'GET  /api/properties',
      'GET  /api/properties/:id',
      'POST /api/properties        (agent|admin)',
      'PUT  /api/properties/:id    (owner|admin)',
      'DEL  /api/properties/:id    (owner|admin)',
      'GET  /api/agents',
      'GET  /api/agents/:id',
      'POST /api/agents/:agentId/messages',
      'GET  /api/users             (admin)',
      'PUT  /api/users/:id         (admin)',
      'DEL  /api/users/:id         (admin)',
      'PUT  /api/users/me',
      'GET  /api/users/me/wishlist',
      'POST /api/users/me/wishlist/:propertyId',
      'DEL  /api/users/me/wishlist/:propertyId',
      'POST /api/test/reset        (non-prod)',
    ],
  };
  app.get('/', (_req, res) => res.json(indexPayload));
  app.get('/api', (_req, res) => res.json(indexPayload));

  // OpenAPI docs.
  const openapiPath = path.resolve(__dirname, '..', 'openapi.yaml');
  if (fs.existsSync(openapiPath)) {
    const spec = YAML.parse(fs.readFileSync(openapiPath, 'utf8'));
    app.get('/api/openapi.json', (_req, res) => res.json(spec));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  app.use('/api/auth', authRoutes);
  app.use('/api/properties', propertyRoutes);
  app.use('/api/agents', agentRoutes);
  app.use('/api/agents', messageRoutes); // POST /:agentId/messages
  app.use('/api/users', userRoutes);
  app.use('/api/users/me/wishlist', wishlistRoutes);
  app.use('/api/test', testRoutes);

  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return app;
}
