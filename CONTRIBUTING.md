# Contributing to CampusTracker

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites
- Node.js 18+ and npm 9+
- A Supabase project (free tier is fine)
- A Gemini API key (free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Getting Started

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/CampusTracker.git
   cd CampusTracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase and Gemini API credentials.

4. **Run database migrations** against your Supabase project (SQL editor or `supabase db push`).

5. **Start the dev server**:
   ```bash
   npm run dev
   ```

## Branch Naming

Use descriptive branch names following this convention:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/calendar-export` |
| `fix/` | Bug fixes | `fix/attendance-count` |
| `refactor/` | Code refactoring | `refactor/hooks-cleanup` |
| `docs/` | Documentation updates | `docs/api-reference` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

## Pull Request Process

1. **Create a branch** from `main` with a descriptive name.
2. **Make your changes** and ensure they pass checks:
   ```bash
   npx tsc --noEmit    # Type checking
   npx eslint .        # Linting
   npm run build       # Production build
   ```
3. **Write a clear PR description** explaining what changed and why.
4. **Keep PRs focused** — one feature or fix per PR.

## Code Style

- **TypeScript**: Strict mode enabled. No `any` without an eslint-disable comment explaining why.
- **React**: Functional components with hooks. Class components only for error boundaries.
- **Imports**: Use `@/` path aliases. Group imports: React → third-party → internal.
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for file names.
- **CSS**: Tailwind utility classes. No inline styles except in `global-error.tsx` (which can't use Tailwind).
- **Comments**: Document _why_, not _what_. Non-obvious logic should have a comment.

## Architecture Overview

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── (app)/        # Authenticated app routes (wrapped in AppShell)
│   ├── (auth)/       # Login, signup, forgot-password
│   └── api/          # Server-side API route handlers
├── components/       # React components
│   ├── ui/           # Base design primitives (Button, Dialog, etc.)
│   ├── layout/       # App shell, sidebar, topbar
│   ├── shared/       # Reusable across features (ErrorBoundary, Logo)
│   └── [feature]/    # Feature-specific (dashboard/, timetable/, etc.)
├── hooks/            # Custom React hooks (data fetching, state)
├── lib/              # Utilities, Supabase clients, validation schemas
└── types/            # TypeScript type definitions
```

## Need Help?

Open an issue or start a discussion. We're happy to help!
