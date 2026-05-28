# Real Estate Platform Demo

A real estate platform built with React, TypeScript, and Express. The project is a deliberately self-contained challenge target so QA Engineers can practise **both web UI and HTTP API** automation against the same application.

<img src='./images/real-estate-platform.png' alt='Real Estate Platform' />

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Aviv-public/aviv-immowelt-qa-technical-assessment.git
cd aviv-immowelt-qa-technical-assessment
```

2. Install dependencies
```bash
npm install
```

3. Start the web app **and** the API (single command, runs concurrently)
```bash
npm run dev
```

This starts:

| Service | URL |
|---|---|
| Web app (Vite) | http://localhost:5173 |
| REST API (Express) | http://localhost:3001 |
| Interactive API docs (Swagger UI) | http://localhost:3001/api/docs |
| OpenAPI 3 spec (JSON) | http://localhost:3001/api/openapi.json |

Vite proxies `/api/*` to the Express server, so calls from the SPA hit the same origin in dev.

You can also run pieces separately:
```bash
npm run dev:web     # vite only
npm run dev:api     # express only (tsx watch)
npm run start:api   # express without watch (for CI/test runs)
```

## 🔐 Test accounts (seeded)

All three accounts share password **`Test123!`**.

| Email | Role |
|---|---|
| `test@example.com` | user |
| `agent@example.com` | agent |
| `admin@example.com` | admin |

## 🔌 REST API

- Base URL: `http://localhost:3001/api`
- Auth: `Authorization: Bearer <jwt>` (issued by `POST /api/auth/login` or `/auth/register`)
- Token lifetime: 24h, HS256
- Persistence: LowDB JSON file at `server/data/db.json` (gitignored; recreated from seed on first boot)
- Full contract: see Swagger UI at `/api/docs`

Key endpoints — see the OpenAPI spec for full request/response shapes:

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | returns `{user, token}` |
| POST | `/api/auth/register` | role `user` or `agent` (admin only via seed) |
| GET | `/api/auth/me` | current user (auth) |
| GET | `/api/properties` | filters: `type`, `status`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `location`, `q`, `sort` |
| GET/POST/PUT/DELETE | `/api/properties/:id` | POST = agent/admin; PUT/DELETE = owner or admin |
| GET | `/api/agents`, `/api/agents/:id` | public |
| POST | `/api/agents/:agentId/messages` | contact form (auth optional) |
| GET | `/api/users` | admin only |
| PUT/DELETE | `/api/users/:id` | admin only |
| PUT | `/api/users/me` | profile + password change (auth) |
| GET/POST/DELETE | `/api/users/me/wishlist[/:propertyId]` | auth |
| POST | `/api/test/reset` | **non-production only** — restore DB to seed |

### Resetting state between test runs

```bash
curl -X POST http://localhost:3001/api/test/reset
```

This rewrites `server/data/db.json` from the seed. The route returns 404 when `NODE_ENV=production`.

### Configuration (environment variables)

| Var | Default | Purpose |
|---|---|---|
| `PORT` | `3001` | API port |
| `JWT_SECRET` | `dev-secret-change-me` | HS256 key |
| `JWT_EXPIRES_IN` | `24h` | Token TTL |
| `DB_PATH` | `server/data/db.json` | LowDB file |
| `SEED_ON_BOOT` | `false` | Force re-seed on startup |
| `SEED_PASSWORD` | `Test123!` | Password hashed into seeded accounts |
| `WEB_ORIGIN` | `http://localhost:5173` | CORS allowlist |
| `NODE_ENV` | `development` | `production` disables `/api/test/reset` |

## 📄 License

This project is MIT licensed.
