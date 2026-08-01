# Public Release Checklist

Pre-flight checks before making the repository public or deploying to production.

## Repository Hygiene

- [x] `.gitignore` covers all sensitive paths (`.env*`, `node_modules`, IDE dirs)
- [x] No secrets committed in git history
- [x] `LICENSE` file present (CampusTracker License)
- [x] `SECURITY.md` with responsible disclosure policy
- [x] `CONTRIBUTING.md` with setup and style guide
- [x] `README.md` with features, setup, and architecture
- [x] `.env.example` contains all required variables with descriptions

## Secret Scanning

- [ ] Run `git log --all -p | grep -iE "key|secret|password|token"` and verify no real credentials appear
- [ ] Verify `.env.local` and `.env.production` are gitignored
- [ ] Rotate any credentials that may have been accidentally committed in the past

## Code Quality

- [x] `npx tsc --noEmit` passes clean
- [x] `npx eslint .` passes (or only has expected warnings)
- [ ] `npm run build` succeeds without errors
- [x] No `TODO` or `FIXME` comments with security implications

## Security

- [x] RLS enabled on all database tables
- [x] API routes validate input with Zod schemas
- [x] API routes sanitize user input
- [x] Rate limiting on sensitive endpoints (AI, feedback)
- [x] Security headers configured (CSP, HSTS, X-Frame-Options)
- [x] File uploads validated (MIME type, size, sanitized filename)
- [x] Error responses never leak stack traces in production

## Documentation

- [x] `ROADMAP.md` reflects actual project state
- [x] `DESIGN.md` documents the design system
- [x] `docs/` directory has architecture and feature documentation
- [ ] API routes documented (endpoint, method, payload, response)

## Dependencies

- [ ] Run `npm audit` and review findings
- [ ] No known critical vulnerabilities in production dependencies
- [ ] All dependencies on recent, maintained versions

## CI/CD (Future)

- [ ] GitHub Actions workflow for type checking + linting on PRs
- [ ] Automated dependency updates (Dependabot / Renovate)
- [ ] Preview deployments for PRs (Vercel does this automatically)
