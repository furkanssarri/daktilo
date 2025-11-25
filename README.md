# Daktilo — Personal Blog (PERN + TypeScript + Prisma)

A personal blog project built as part of The Odin Project fullstack curriculum. Daktilo is a small, production‑ready blog built with the PERN stack (Postgres, Express, React, Node) and TypeScript. It uses Prisma as the ORM, fully utilizes a RESTful API, and aims to be simple, extensible, and suitable for use as a real personal blog.

## Goals

- Learn and apply fullstack web development patterns from The Odin Project.
- Ship a maintainable personal blog with posts, comments, tags, categories, users and admin tooling.
- Use TypeScript end-to-end, Prisma for type-safe DB access, and modern React with Vite.
- Create a full-fledged RESTful API between the frontend and the server.

## Live Demo

A working [live-demo](https://daktilo.netlify.app/) can be found here.

## Tech stack

- Frontend: React (Vite), TypeScript, shadcn/ui, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + Passport (backend)
- Storage: local/public + optional Supabase client integrated in backend config
- Monorepo: npm workspaces

## Important dependencies

(Selected dependency lists taken from the three package.json files in this repo.)

### Frontend (packages/frontend-blog/package.json)

```typescript
{
  "dependencies": {
    "cmdk": "^1.1.1",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.552.0",
    "next-themes": "^0.4.6",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.5",
    "sonner": "^2.0.7",
    "tailwindcss": "^4.1.16"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.1.16",
    "@vitejs/plugin-react": "^5.0.4",
    "eslint": "^9.36.0",
    "typescript": "~5.9.3",
    "vite": "^7.1.7",
    "vitest": "^4.0.9"
  }
}
```

### Backend (packages/backend/package.json)

```typescript
{
  "dependencies": {
    "@prisma/client": "^6.18.0",
    "@supabase/supabase-js": "^2.79.0",
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "slug": "^11.0.1"
  },
  "devDependencies": {
    "jest": "^30.2.0",
    "prisma": "^6.18.0",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3"
  }
}
```

### Root workspace (package.json)

```typescript
{
  "devDependencies": {
    "concurrently": "^7.6.0"
  },
  "workspaces": [
    "packages/backend",
    "packages/frontend-blog",
    "packages/frontend-admin",
    "packages/shared"
  ]
}
```

## Getting started (development)

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+)
- PostgreSQL (a running DB instance)
- Optional: supabase or other object storage if you plan to use remote media

1. Clone

```bash
git clone <repo-url>
cd daktilo
```

2. Install dependencies (workspace)

```bash
npm install
```

This installs dependencies for all workspaces. Alternatively install per-package:

```bash
cd packages/backend && npm install
cd ../frontend-blog && npm install
```

3. Create PostgreSQL database and .env files

- Create a Postgres database (locally or cloud).
- Copy example env files (create your own):
  - packages/backend/.env
  - packages/frontend-blog/.env

Example backend `.env` (packages/backend/.env)

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your_jwt_secret"
PORT=3000
# optional: supabase keys if you plan to use Supabase for uploads
SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

Example frontend `.env` (packages/frontend-blog/.env)

```bash
VITE_API_BASE_URL="http://localhost:5000/api"
# any other Vite env vars prefixed with VITE_...
```

4. Prisma: generate client, run migrations, run seed

From repo root you can target workspace with npm workspace commands.

Generate Prisma client:

```bash
npm --workspace=@daktilo/backend run prisma:generate
# or
cd packages/backend && npm run prisma:generate
```

Run migrations (interactive dev migration):

```bash
# from packages/backend
npx prisma migrate dev --schema=./prisma/schema.prisma
```

If you have a seed script (packages/backend/prisma/seed.ts), run it after migrations. Example:

```bash
# compile + run seed if it's TS; using tsx (installed as dev dep)
cd packages/backend
npx tsx prisma/seed.ts
```

5. Start dev servers

Option A — start both from root using workspace script

```bash
# this uses the root dev:all script (runs concurrently)
npm run dev:all
```

Option B — run individually

```bash
# backend
npm --workspace=packages/backend run dev
# or
cd packages/backend && npm run dev

# frontend (Vite)
npm --workspace=packages/frontend-blog run dev
# or
cd packages/frontend-blog && npm run dev
```

Open frontend: [localhost:5174](http://localhost:5174) (NOT Vite default) — confirm API base points to backend (VITE_API_BASE_URL).

6. Tests

- Frontend tests: run from packages/frontend-blog with `npm run test`.
- Backend tests: run from packages/backend with `npm run test`.

## Notes on auth & uploads

- Backend uses Passport + JWT for authentication.
- Media model uses Prisma; adjust behavior and permissions in your backend routes/middlewares if you want admin-only uploads or different avatar/post-image rules.
- Role-based access is enforced by middlewares in `src/middlewares/requireRole.ts` and `requireAuth.ts`.

## Project structure (concise)

### packages/backend

```txt
packages/backend
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ index.ts                 # express app entry
│  ├─ controllers/
│  ├─ routes/
│  ├─ middlewares/
│  │  ├─ requireAuth.ts
│  │  └─ requireRole.ts
│  ├─ db/
│  │  └─ prismaClient.ts
│  └─ utils/
├─ package.json
└─ tsconfig.json
```

### packages/frontend-blog

```txt
packages/frontend-blog
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ api/
│  │  ├─ apiClient.ts
│  │  ├─ commentApi.ts
│  │  └─ postApi.ts
│  ├─ components/
│  │  ├─ layout/
│  │  └─ ui/
│  ├─ pages/
│  ├─ context/
│  ├─ utils/
│  └─ styles/
├─ public/
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

## Deployment

- Build frontend with `npm --workspace=packages/frontend-blog` run build and serve static from any host (Netlify, Vercel, or serve via backend public folder).
- Backend: build TypeScript (`npm --workspace=packages/backend run build`) and run npm `--workspace=packages/backend start`. Ensure `DATABASE_URL and JWT_SECRE`are set in production env.

## Contributing

`
Use the workspace scripts.
Keep changes to Prisma schema in packages/backend/prisma/schema.prisma and create migrations using Prisma CLI.

## License

This project is licensed under the MIT License — add a LICENSE file with the following content:
