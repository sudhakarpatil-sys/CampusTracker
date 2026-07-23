# CampusTracker

CampusTracker helps college students manage attendance, assignments,
timetable, exams, notes, and productivity in one private, calm dashboard.

**Status: Phase 1 (foundation) + Phase 2 (academic management system).**
Phase 1 covers auth, onboarding, profile, dashboard shell, navigation,
settings, and theming. Phase 2 adds the full academic system: subjects,
a drag-and-drop timetable, one-click attendance with analytics and
predictions, assignments (Kanban/List/Calendar), notes, tasks, events,
exams, a unified calendar, global search, and quick actions — all backed
by Supabase with Row Level Security and real-time sync.

## Tech stack

| Layer      | Choice                                                        |
| ---------- | -------------------------------------------------------------- |
| Frontend   | Next.js 14 (App Router), React 18, TypeScript                  |
| Styling    | Tailwind CSS, shadcn/ui-style components, Framer Motion         |
| Icons      | lucide-react                                                    |
| Auth/DB    | Supabase (Auth, Postgres, Row Level Security, Storage)          |
| Forms      | React Hook Form + Zod                                           |
| Deployment | Vercel                                                          |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll also need a Supabase project with the Phase 1 schema applied —
see **[supabase/README.md](./supabase/README.md)** for the full setup
(migration, Google OAuth, redirect URLs).

### Environment variables

| Variable                        | Required | Notes                                          |
| -------------------------------- | -------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Yes      | Project Settings → API                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Yes      | Project Settings → API (anon/public key)        |
| `NEXT_PUBLIC_SITE_URL`            | Yes      | Used for OAuth/email redirect links             |
| `SUPABASE_SERVICE_ROLE_KEY`       | No       | Only needed for future server-only admin routes |

## Folder structure

```
src/
  app/
    (marketing)/            Public landing page + its layout (navbar/footer)
    (auth)/                 Login, signup, forgot/reset password, verify-email
    (app)/                  Everything behind auth: dashboard, feature pages, settings
    onboarding/              Full-screen onboarding flow (outside the app shell)
    auth/callback/           OAuth + email-link exchange route
    offline/                 Offline state page
    globals.css              Design tokens + Tailwind layers
    layout.tsx               Root layout: fonts, ThemeProvider, Toaster
    not-found.tsx / error.tsx / global-error.tsx   Error + 404/500 states
  components/
    ui/                      Hand-written shadcn/ui-style primitives (button, card, dialog, ...)
    landing/                 Landing page sections (hero, features, FAQ, ...)
    auth/                    Auth forms + shared auth shell
    onboarding/              Multi-step onboarding form
    dashboard/               Dashboard grid + widget shell + widgets/
    layout/                  App shell: sidebar, topbar, breadcrumbs, notifications, user menu
    settings/                Settings tabs + one form per settings section
    shared/                  Cross-cutting UI: theme provider/toggle, empty states, avatar upload
  hooks/                     use-user, use-theme (via context), use-widgets, use-notifications, use-toast
  lib/
    supabase/                Browser client, server client, middleware session helper
    validations/              Zod schemas for auth, onboarding, profile forms
    constants.ts              Nav items, dropdown options, default widget order
    utils.ts                  cn(), formatDate(), getInitials()
  types/
    database.types.ts         Hand-authored types mirroring the SQL schema
  middleware.ts                Auth guard + onboarding-gate redirect logic
supabase/
  migrations/0001_init.sql     Tables, RLS policies, triggers, storage bucket
  README.md                     Step-by-step Supabase setup guide
```

## Architecture notes

- **Route groups separate concerns.** `(marketing)`, `(auth)`, and `(app)`
  each have their own layout, so the landing page's navbar/footer never
  leak into the dashboard shell, and auth screens stay full-bleed.
- **Auth + onboarding gating lives in `middleware.ts`.** It refreshes the
  Supabase session on every request, then makes exactly one redirect
  decision: unauthenticated → landing page, authenticated-but-incomplete
  onboarding → `/onboarding`, authenticated on an auth page → `/dashboard`.
  Pages themselves don't need to repeat this logic.
- **Two Supabase clients, one helper.** `lib/supabase/client.ts` is for
  Client Components, `lib/supabase/server.ts` is for Server Components/Route
  Handlers, and `lib/supabase/middleware.ts` is the shared piece both the
  middleware and (indirectly) the server client rely on for cookie syncing.
- **Every table is RLS-scoped to `auth.uid()`.** See
  `supabase/migrations/0001_init.sql` — no table can be read or written by
  anyone other than its owner, including via the client-side anon key.
- **Dashboard widgets are decoupled from the grid.** `useWidgets()` owns
  order/visibility (persisted to `localStorage` for now, designed to move to
  `user_preferences.dashboard_layout` once that's wired up), while each
  widget is a self-contained component under `components/dashboard/widgets/`.
  Adding a real widget later means building the data-fetching version and
  swapping it into `WIDGET_MAP` in `dashboard-grid.tsx`.
- **Placeholder feature pages share one component.** `ComingSoonPage` in
  `components/shared/coming-soon.tsx` keeps Attendance/Assignments/Timetable/
  Notes/Calendar/Exams/Analytics visually consistent until each ships.
- **Design tokens are centralized** in `src/app/globals.css` (CSS variables
  for light/dark) and `tailwind.config.ts` (semantic color names). Changing
  the palette means editing one file, not hunting through components.

## Design direction

See **[DESIGN.md](./DESIGN.md)** for the rationale behind the visual
system — palette, typography, and the "notebook margin" signature motif
used across the landing page and dashboard.

## Scripts

| Command            | Description                          |
| ------------------- | ------------------------------------- |
| `npm run dev`        | Start the dev server                  |
| `npm run build`      | Production build                      |
| `npm run start`      | Serve the production build            |
| `npm run lint`       | ESLint                                |
| `npm run typecheck`  | `tsc --noEmit`                         |

## Deploying

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env.example`.
4. Add your Vercel deployment URL to Supabase's Redirect URLs (see
   `supabase/README.md`).

## Roadmap (not yet built)

AI assistant · general productivity Analytics page · PWA/offline mode ·
push notifications · multi-device sync beyond Supabase's built-in
realtime · QR attendance · OCR assignment scanner · WhatsApp/Discord
notifications · premium plans · rich WYSIWYG note editing (notes currently
use Markdown with live preview, not a full WYSIWYG rich-text editor) ·
inline attachment previews for assignments (the `attachments` jsonb column
exists and is ready, but the UI for it isn't built yet — notes already
have working attachment upload).

The database schema, RLS design, and hook architecture from Phase 2 were
built so each of these is additive rather than a rewrite.
