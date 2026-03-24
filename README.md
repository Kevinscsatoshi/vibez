# vibeZ

Builder network for AI project shipping stories, now with Supabase auth and playground snippets.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Start dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Auth + Callback Notes

- Email/password and GitHub OAuth are both enabled on `/signin`.
- OAuth callback route: `/auth/callback`.
- `next` query parameter is sanitized to in-app paths only.
- In production, set `NEXT_PUBLIC_APP_URL` to your public domain so OAuth callbacks always return to the correct host.

## Local 404 Quick Diagnosis

If you see `ERR_CONNECTION_REFUSED` or a local 404:

1. **Dev server status**: rerun `npm run dev` and confirm `Ready`.
2. **Port conflict**: check output for auto-switch to `3001`/other port.
3. **Wrong URL**: ensure your browser uses the active port shown by Next.
4. **Env mismatch**: verify `.env.local` values are real (not placeholders).
5. **Build cache issue**: stop server, delete `.next`, restart `npm run dev`.

## Playground Integration (V1)

- `projects.snippet_id` links one project to one playground snippet.
- Create flow accepts snippet ID or `/playground/:id` URL.
- Project cards and project detail pages surface linked playground entry points.
