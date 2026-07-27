# Phase 3A — AI Smart Timetable Import

Verified against your actual repo (CampusTracker-main.zip): `npx tsc --noEmit`
and `npx eslint` both pass clean on this code, including all existing
Phase 1/2 files. `next build` itself couldn't complete in the sandbox this
was built in — it failed only on fetching Google Fonts, which that
sandbox's network policy blocks; unrelated to this code and won't affect
your real deploy.

## How to apply

1. Copy every file in this archive into your repo at the matching path,
   overwriting: `src/types/database.types.ts`, `src/middleware.ts`,
   `src/components/timetable/timetable-grid.tsx`, `package.json`,
   `package-lock.json`, and `.env.example`.
2. Run `npm install` (package.json/package-lock.json both changed —
   new deps: `@google/generative-ai`, `pdf-parse`, `@radix-ui/react-checkbox`,
   `@types/pdf-parse`).
3. Add `GEMINI_API_KEY` to `.env.local` and to Vercel's env vars
   (Production + Preview). Get a free key, no card required, at
   https://aistudio.google.com/apikey
4. Run the four new migrations in order against your Supabase project
   (SQL editor, or `supabase db push` if linked):
   `0004_timetable_import.sql` → `0005_timetable_import_extraction.sql` →
   `0006_timetable_import_conflicts.sql` → `0007_timetable_import_lineage.sql`
5. `npm run dev`, sign in, go to `/timetable`, click **Import with AI**.

## What changed, and why

**New tables:** `timetable_imports`, `timetable_import_items` — staging
area for an upload as it moves through extraction → AI structuring →
review → import. Nothing writes to your real `subjects`/`timetable_slots`
until the student confirms on the Review screen.

**Extended existing tables (additive, non-breaking):**
- `subjects` gained `created_via` (manual/ai_import) and `source_import_id`
- `timetable_slots` gained `source_import_id`
Both default/nullable — every existing row is unaffected.

**New API routes** (`src/app/api/timetable-import/[id]/...`) — the first
API routes in this codebase. Each does one job (extract → structure →
generate → import) and is independently retryable.

**Real bug found and fixed:** your `middleware.ts` matcher doesn't exclude
`/api/*`, so unauthenticated calls to these new routes would have gotten
redirected to `/` (an HTML page) instead of the JSON 401 the client fetch()
calls expect. Fixed by short-circuiting the redirect logic for `/api/`
paths — each route still does its own `supabase.auth.getUser()` check.

**Second real bug found and fixed (session redirect):** `AUTH_ROUTES` in
`middleware.ts` didn't include `"/"`, so a logged-in user landing on the
root URL (e.g. reopening a closed tab, clicking a bookmark) saw the
logged-out marketing page instead of being bounced to `/dashboard` —
even though their session cookie was still valid the whole time (which
is why typing `/dashboard` directly always worked). Fixed by adding `"/"`
to `AUTH_ROUTES`, matching the same exact-path redirect already used for
`/login`/`/signup`/`/forgot-password`. This is unrelated to Phase 3A but
bundled in the same middleware.ts file, so it ships in this same drop-in.

**Missing UI primitive added:** `src/components/ui/checkbox.tsx` didn't
exist in your `ui/` folder; added it in the same style as your other
Radix-based primitives (Select, Tabs, Dialog).

**AI provider:** Gemini (`gemini-2.5-flash`), not Anthropic/OpenAI — free
tier, no card required, chosen specifically because it handles both text
and scanned/photo timetables (PDF + image input) in one call. See
`src/lib/timetable-import/ai-structure.ts` for the model name and the
one-line swap to `gemini-2.5-flash-lite` if you hit daily free-tier limits.

**Prompt refined against a real timetable:** tested against an actual
4-page MIT Mumbai CSE/AIML/IT/EE timetable PDF you provided. Found and
fixed three real gaps before they'd have caused bad extractions:
1. Merged cells showing two divisions' parallel labs in one cell (now
   explicitly split, keeping only the student's own division).
2. Subjects appearing in the grid but missing from the course legend
   (e.g. "COA", "Yoga") — now still included rather than dropped.
3. "Short Break"/"Long Break" columns — now explicitly ignored as
   structural, not lecture slots.

**Cost/rate-limit guards, since this runs on a free tier:**
- Checksum-based duplicate detection runs *before* any Storage write or
  AI call (cheapest place to catch a re-upload).
- A student is capped at 5 imports/24h (`MAX_UPLOADS_PER_DAY` in
  `duplicate-detection.ts`) as a deliberate, visible safeguard — not a
  silent throttle.
- Gemini 429s get a short exponential backoff (`withRetry` in
  `ai-structure.ts`) since free-tier per-minute limits are expected under
  normal use, not a bug.

## Known limitation, flagged not hidden

No multi-table Postgres transaction wraps the import route's sequential
writes (subjects → slots → status update) — Supabase's JS client doesn't
give that without an RPC function. Consistent with the same tradeoff
already accepted in `generate-items` (delete+insert, no transaction). Fine
at personal scale; if it ever bites, the fix is wrapping
`api/timetable-import/[id]/import/route.ts`'s logic in a single `plpgsql`
function called via `.rpc(...)`.

## Follow-up: student batch field (post-launch addition)

Added after initial testing surfaced that some divisions split into
parallel lab batches (e.g. Division A → batches A1/A2, each doing a
different lab in a different room at the same time). Without knowing
which batch a student is in, the AI had to guess — which would silently
produce wrong attendance data for one batch's worth of students on every
affected lab slot.

**New migration:** `0008_profile_batch.sql` — adds `profiles.batch`
(nullable text, e.g. `"A1"`). Purely additive; every existing profile is
unaffected.

**Collected in two places:**
- Onboarding flow, step "Academic details" (optional field, doesn't block
  completion).
- Settings → Profile (the more important entry point in practice, since
  every existing student already onboarded before this field existed).

**Used by:** `ai-structure.ts`'s system prompt — when a cell shows two
labeled parallel sessions, it now matches against the student's actual
batch instead of defaulting to "first line, low confidence." Falls back
to the old first-line/low-confidence behavior only if batch is unset or
doesn't match anything in the document (e.g. a student who hasn't filled
it in yet, or a document using an unexpected labeling convention).

**Not required.** A student who never sets a batch loses nothing — they
get the same best-effort fallback behavior as before this addition, they
just won't get the disambiguation benefit until they fill it in via
Settings.
