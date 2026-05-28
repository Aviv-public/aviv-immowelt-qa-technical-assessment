import { createApp } from './app.js';
import { config } from './config.js';
import { getDb } from './db/lowdb.js';

async function main() {
  await getDb(); // ensures seed
  const app = createApp();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `[api] listening on http://localhost:${config.port}  (env=${config.nodeEnv})`,
    );
    // eslint-disable-next-line no-console
    console.log(`[api] docs:    http://localhost:${config.port}/api/docs`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[api] fatal:', err);
  process.exit(1);
});
