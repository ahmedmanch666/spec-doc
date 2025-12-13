# Spec-Doc

## Production deployment (Vercel)

This project is deployed on Vercel and auto-deploys on every push to `main`.

### Required environment variables

Set these in Vercel **Project → Settings → Environment Variables**:

- `DATABASE_URL` (Postgres connection string) **or** `POSTGRES_URL` (Vercel Postgres Storage)
- `NODE_ENV=production`
- `VITE_API_BASE=/api`

If you are using authentication / tokens in your deployment:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

### Database / migrations

This repo uses Drizzle.

- Push schema to the database:
  - `npm run db:push`

- Seed initial data (admin user + sample content):
  - `npm run db:seed`

### Vercel Postgres (Storage)

1. Create **Vercel Postgres** from **Storage** in Vercel.
2. Connect it to this project.
3. Vercel will provide `POSTGRES_URL` automatically. You can also set `DATABASE_URL` explicitly if desired.

If `DATABASE_URL` is missing, API requests under `/api/*` will return `503` and the admin UI will show a friendly "Database not connected" empty-state.

### Local production-like run (Windows)

Build:

- `npm.cmd run build`

Start (CMD):

- `cmd /c "set NODE_ENV=production&& set HOST=127.0.0.1&& set PORT=5000&& node dist\\index.cjs"`
