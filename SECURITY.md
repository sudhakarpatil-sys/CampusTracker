# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅         |

## Reporting a Vulnerability

If you discover a security vulnerability in CampusTracker, please report it responsibly:

1. **Do NOT** open a public GitHub issue for security vulnerabilities.
2. Email your findings to the repository maintainer (see the repo profile).
3. Include:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (optional)

## Response Timeline

- **Acknowledgment**: Within 48 hours of receiving your report
- **Initial Assessment**: Within 5 business days
- **Resolution**: Depends on severity (Critical: ASAP, High: 1 week, Medium: 2 weeks)

## Scope

### In Scope
- Authentication and session management vulnerabilities
- Row Level Security (RLS) policy bypasses
- Cross-Site Scripting (XSS) via user input
- Cross-Site Request Forgery (CSRF)
- SQL injection (via Supabase client misuse)
- Insecure Direct Object References (IDOR)
- API rate limiting bypass
- Sensitive data exposure (API keys, user data)

### Out of Scope
- Supabase platform infrastructure vulnerabilities (report to [Supabase Security](https://supabase.com/security))
- Vercel hosting infrastructure (report to [Vercel Security](https://vercel.com/security))
- Denial of Service (DoS) via excessive API calls (managed at infrastructure level)
- Social engineering attacks
- Issues in third-party dependencies (report upstream)

## Security Measures

CampusTracker implements the following security measures:

- **Authentication**: Supabase Auth with JWT-based sessions
- **Authorization**: Row Level Security (RLS) on all database tables
- **Input Validation**: Zod schemas on both client and server
- **Input Sanitization**: XSS prevention via HTML encoding and script stripping
- **Rate Limiting**: Per-IP sliding window on all API endpoints
- **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Audit Logging**: All user actions logged to an append-only audit trail
- **File Upload Validation**: MIME type and size restrictions
