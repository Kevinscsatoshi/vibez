# vibeZ

Builder network for AI project shipping stories.  
This version includes real publishing, file/zip uploads, and GitHub repo sync with README ingestion.

## Features

- Email/password and GitHub sign-in.
- Multi-step project publishing flow.
- Upload code files or a full zip archive to a project.
- Optional project-to-snippet link via `projects.snippet_id`.
- Optional project-to-GitHub link with:
  - initial repo metadata + README sync
  - manual `Sync now`
  - webhook push auto-sync
- Likes/favorites and profile sections for liked/favorited projects.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-only (required for GitHub sync + webhook path)
SUPABASE_SERVICE_ROLE_KEY=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_WEBHOOK_SECRET=...
```

3. Run database migrations:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

4. Start dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Required Supabase Migrations

Core schema and app features rely on:

- `001_initial_schema.sql`
- `002_fix_email_signups.sql`
- `003_likes_system.sql`
- `004_playground.sql`
- `005_project_snippet_link.sql`
- `006_publish_and_assets.sql`
- `007_github_sync.sql`

## GitHub Integration Notes

- User connects GitHub from create flow.
- OAuth callback route: `/api/github/callback`.
- Repo list API: `/api/github/repos`.
- Manual sync API: `/api/github/sync`.
- Webhook route: `/api/github/webhook` (expects `X-Hub-Signature-256`).
- On sync, repo metadata and `README` content update `projects.github_*` fields.

## Auth + Callback Notes

- App sign-in callback route: `/auth/callback`.
- `next` query parameter is sanitized to in-app paths only.
- Set `NEXT_PUBLIC_APP_URL` to your public domain in all Vercel environments to avoid callback host drift.

## Local 404 Quick Diagnosis

If you see `ERR_CONNECTION_REFUSED` or a local 404:

1. Dev server status: rerun `npm run dev` and confirm `Ready`.
2. Port conflict: check output for auto-switch to `3001`/other port.
3. Wrong URL: ensure browser uses the active port shown by Next.
4. Env mismatch: verify `.env.local` values are real (not placeholders).
5. Build cache issue: stop server, delete `.next`, restart `npm run dev`.
