# Persistent approvals (Vercel KV / Redis)

Your `/admin` approvals must be stored in a database/kv store for them to persist on the live site.

This repo supports **Vercel KV-style env vars** via `@vercel/kv`.

## 1) Create the store on Vercel

- In Vercel Dashboard → **Storage** (or Marketplace) → add a **Redis/KV** integration.
- Vercel will generate environment variables for the project.

## 2) Add env vars

Set these in Vercel (Project → Settings → Environment Variables):

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN` (required for approve/disapprove updates)
- `KV_REST_API_READ_ONLY_TOKEN` (optional; used for read-only environments)

For local development, add the same values to `.env.local`.

## 3) How it works

- Public route: `GET /api/projects` reads approvals from KV (falls back to `approved-projects.json` locally).
- Admin route: `POST /api/admin/projects` writes approvals to KV (falls back to `approved-projects.json` locally).

## 4) First deploy seeding

If KV is empty on first deploy, the server will try to **seed KV from `approved-projects.json`** (only if the KV write token exists).

## Troubleshooting

- If approvals work locally but not on Vercel: KV env vars are missing.
- If the public list updates but admin saving fails: `KV_REST_API_TOKEN` is missing (read-only token can’t write).
