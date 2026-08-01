/**
 * In-memory sliding-window rate limiter.
 *
 * Suitable for application-level abuse prevention behind platforms like
 * Vercel/Cloudflare that provide infrastructure-level DDoS mitigation.
 * Resets on serverless cold starts — this is intentional; persistent
 * rate limiting (e.g., via Upstash Redis) can be added later.
 *
 * Usage in an API route:
 * ```ts
 * const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 10 });
 *
 * export const POST = withErrorHandler(async (request) => {
 *   await limiter.check(request);  // throws ApiError if exceeded
 *   // ... your logic ...
 * });
 * ```
 */

import { ApiError } from "@/lib/api-error";

interface RateLimitConfig {
  /** Window duration in milliseconds. */
  windowMs: number;
  /** Maximum requests allowed within the window. */
  maxRequests: number;
  /** Key extractor — defaults to IP-based. */
  keyGenerator?: (request: Request) => string;
}

interface RateLimitEntry {
  timestamps: number[];
}

const DEFAULT_KEY_GENERATOR = (request: Request): string => {
  // Try common proxy headers, fall back to a generic key.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
};

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyGenerator = DEFAULT_KEY_GENERATOR } = config;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent unbounded memory growth.
  // Runs every 5 minutes (or every windowMs if shorter).
  const cleanupInterval = Math.min(windowMs, 5 * 60 * 1000);
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < cleanupInterval) return;
    lastCleanup = now;
    const cutoff = now - windowMs;
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  }

  return {
    /**
     * Checks the rate limit for a given request. Throws `ApiError` with
     * status 429 if the limit is exceeded.
     */
    check(request: Request): void {
      cleanup();

      const key = keyGenerator(request);
      const now = Date.now();
      const cutoff = now - windowMs;

      const entry = store.get(key) ?? { timestamps: [] };
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

      if (entry.timestamps.length >= maxRequests) {
        const oldestInWindow = entry.timestamps[0] ?? now;
        const retryAfterMs = oldestInWindow + windowMs - now;
        const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
        throw ApiError.rateLimited(retryAfterSeconds);
      }

      entry.timestamps.push(now);
      store.set(key, entry);
    },

    /** Returns remaining requests for a key (useful for headers). */
    remaining(request: Request): number {
      const key = keyGenerator(request);
      const now = Date.now();
      const cutoff = now - windowMs;
      const entry = store.get(key);
      if (!entry) return maxRequests;
      const active = entry.timestamps.filter((t) => t > cutoff).length;
      return Math.max(0, maxRequests - active);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Pre-configured limiters for common scenarios
// ─────────────────────────────────────────────────────────────────────────

/** AI endpoints — 10 requests per minute per IP. */
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
});

/** Standard API endpoints — 60 requests per minute per IP. */
export const standardRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
});

/** Feedback submissions — 5 per hour per IP. */
export const feedbackRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
});
