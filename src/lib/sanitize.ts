/**
 * Input sanitization utilities.
 *
 * These provide defence-in-depth against XSS, path traversal, and
 * injection attacks. They complement Zod validation (which checks
 * shape/format) with content-level cleaning.
 */

// ─────────────────────────────────────────────────────────────────────────
// String sanitization
// ─────────────────────────────────────────────────────────────────────────

/**
 * Strips HTML tags and encodes dangerous characters. Use on user-supplied
 * strings before storing or rendering them.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Light sanitization that preserves legitimate formatting (Markdown
 * content in notes) but strips script-injection vectors.
 */
export function sanitizeMarkdown(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript\s*:/gi, "")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────
// File name sanitization
// ─────────────────────────────────────────────────────────────────────────

/**
 * Sanitizes a filename to prevent path-traversal and shell-injection attacks.
 * Strips directory separators, null bytes, and reserved characters.
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/\0/g, "")             // null bytes
    .replace(/\.\./g, "")           // directory traversal
    .replace(/[/\\]/g, "")          // path separators
    .replace(/[<>:"|?*]/g, "")      // Windows reserved chars
    .replace(/^\.+/, "")            // leading dots (hidden files)
    .trim()
    .slice(0, 255);                 // filesystem name limit
}

// ─────────────────────────────────────────────────────────────────────────
// URL sanitization
// ─────────────────────────────────────────────────────────────────────────

/**
 * Validates and sanitizes a URL. Returns the cleaned URL string or `null`
 * if the URL is invalid or uses a dangerous scheme (javascript:, data:).
 */
export function sanitizeUrl(input: string): string | null {
  try {
    const url = new URL(input);
    const safeProtocols = new Set(["http:", "https:", "mailto:"]);
    if (!safeProtocols.has(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Generic helpers
// ─────────────────────────────────────────────────────────────────────────

/** Truncates a string to `maxLength` characters, appending ellipsis if cut. */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 1) + "…";
}

/**
 * Removes control characters (except newlines and tabs) that could
 * corrupt JSON, CSV exports, or database entries.
 */
export function stripControlChars(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
