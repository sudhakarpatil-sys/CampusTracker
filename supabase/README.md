# Supabase setup guide

CampusTracker uses Supabase for auth, Postgres, and file storage. This
guide gets a fresh project ready for Phase 1.

## 1. Create a project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Note your **Project URL** and **anon public key** (Settings → API) —
   you'll need these for `.env.local`.

## 2. Run the schema migrations

**Option A — SQL editor (fastest):**
Open the SQL editor in your project dashboard and run, in order:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_academic_system.sql`
3. `supabase/migrations/0003_fix_profile_bootstrap.sql`

**Option B — Supabase CLI:**

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

This creates:

- `profiles`, `user_preferences`, `notifications` tables (0001), the full
  academic system — subjects, timetable, attendance, assignments, notes,
  tasks, events, exams (0002), plus a repair pass (0003, see below)
- Row Level Security policies scoping every row to `auth.uid()`
- A trigger that creates a blank `profiles` + `user_preferences` row the
  moment someone signs up
- The public `avatars` and `attachments` storage buckets with per-user
  upload policies

### About 0003_fix_profile_bootstrap.sql

If you applied 0001 before creating any test users, you don't need this
— it's a no-op. It exists to fix a real bug found in a production audit:
the sign-up trigger that creates a `profiles` row can fail to run for a
user created before the trigger existed (or before migrations were fully
applied), which left `onboarding_completed` permanently unset and caused
an infinite onboarding→dashboard→onboarding redirect loop. This migration
hardens the trigger (idempotent, exception-safe) and backfills a
`profiles`/`user_preferences` row for any existing `auth.users` that are
missing one — so it's always safe to run, including on a project that
already has real users.

## 3. Enable Google sign-in (optional but recommended)

1. Authentication → Providers → **Google** → toggle on.
2. Create OAuth credentials in the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (Web application type).
3. Add the redirect URI Supabase shows you (looks like
   `https://<project-ref>.supabase.co/auth/v1/callback`) to the Google
   OAuth client's **Authorized redirect URIs**.
4. Paste the resulting Client ID/Secret back into Supabase.

## 4. Configure auth redirect URLs

Authentication → URL Configuration:

- **Site URL**: `http://localhost:3000` in development,
  your production domain later.
- **Redirect URLs**: add `http://localhost:3000/auth/callback` (and the
  production equivalent once deployed).

## 5. Environment variables

Copy `.env.example` to `.env.local` and fill in the two Supabase values.
See the root `README.md` for the full variable list.

## 6. Regenerate types (optional)

`src/types/database.types.ts` is hand-written to match the migration
above. Once the CLI is linked, you can regenerate it directly from the
live schema:

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

## Notes on account deletion

The "Delete account" button in Settings signs the user out and shows a
confirmation message, but does not yet call `auth.admin.deleteUser()`,
because that requires the **service role key**, which must never reach
the browser. When you're ready to make deletion immediate, add a Route
Handler (e.g. `src/app/api/account/route.ts`) that uses a server-only
Supabase client built with `SUPABASE_SERVICE_ROLE_KEY`, and call it from
`AccountDangerZone`.
