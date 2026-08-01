import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────
// Error codes — typed constants for consistent client-side handling.
// ─────────────────────────────────────────────────────────────────────────

export const ErrorCode = {
  AUTH_ERROR: "AUTH_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  FORBIDDEN: "FORBIDDEN",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  UNSUPPORTED_FILE_TYPE: "UNSUPPORTED_FILE_TYPE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

// ─────────────────────────────────────────────────────────────────────────
// API Error class
// ─────────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  public readonly code: ErrorCodeType;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(code: ErrorCodeType, message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  /** Convenience factories for common errors. */

  static unauthorized(message = "Not signed in") {
    return new ApiError(ErrorCode.AUTH_ERROR, message, 401);
  }

  static forbidden(message = "You don't have permission to do that") {
    return new ApiError(ErrorCode.FORBIDDEN, message, 403);
  }

  static notFound(entity = "Resource") {
    return new ApiError(ErrorCode.NOT_FOUND, `${entity} not found`, 404);
  }

  static conflict(message: string) {
    return new ApiError(ErrorCode.CONFLICT, message, 409);
  }

  static validation(message: string, details?: unknown) {
    return new ApiError(ErrorCode.VALIDATION_ERROR, message, 400, details);
  }

  static rateLimited(retryAfterSeconds: number) {
    return new ApiError(
      ErrorCode.RATE_LIMIT_ERROR,
      `Too many requests. Try again in ${retryAfterSeconds} seconds.`,
      429,
    );
  }

  static fileTooLarge(maxSizeMB: number) {
    return new ApiError(ErrorCode.FILE_TOO_LARGE, `File exceeds the ${maxSizeMB}MB limit`, 413);
  }

  static unsupportedFileType(allowed: string[]) {
    return new ApiError(
      ErrorCode.UNSUPPORTED_FILE_TYPE,
      `Unsupported file type. Allowed: ${allowed.join(", ")}`,
      400,
    );
  }

  static internal(message = "An unexpected error occurred") {
    return new ApiError(ErrorCode.INTERNAL_ERROR, message, 500);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Response helpers — every API route should use these instead of raw
// NextResponse.json() so the client always sees a predictable shape.
// ─────────────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCodeType;
    message: string;
    details?: unknown;
  };
}

/**
 * Standard success response. Status defaults to 200.
 * Usage: `return createSuccessResponse({ exams: [] })`
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data } as const, { status });
}

/**
 * Standard error response, built from an ApiError or a raw Error.
 * Usage: `return createErrorResponse(ApiError.unauthorized())`
 */
export function createErrorResponse(error: ApiError): NextResponse<ApiErrorResponse>;
export function createErrorResponse(error: Error, status?: number): NextResponse<ApiErrorResponse>;
export function createErrorResponse(error: ApiError | Error, status?: number): NextResponse<ApiErrorResponse> {
  if (error instanceof ApiError) {
    const headers: HeadersInit = {};
    // Attach Retry-After header for rate-limit responses.
    if (error.code === ErrorCode.RATE_LIMIT_ERROR && error.details && typeof error.details === "number") {
      headers["Retry-After"] = String(error.details);
    }
    return NextResponse.json(
      {
        success: false as const,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined && { details: error.details }),
        },
      },
      { status: error.status, headers },
    );
  }

  // Generic Error fallback — never leak stack traces to the client.
  return NextResponse.json(
    {
      success: false as const,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: error.message || "An unexpected error occurred",
      },
    },
    { status: status ?? 500 },
  );
}

/**
 * Wraps an async route handler with consistent try/catch.
 * Catches thrown ApiErrors and returns the proper JSON, and catches
 * unexpected errors as 500s without leaking internals.
 *
 * Usage:
 * ```ts
 * export const POST = withErrorHandler(async (request) => {
 *   // ... your logic ...
 *   return createSuccessResponse({ ok: true });
 * });
 * ```
 */
export function withErrorHandler<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ApiError) {
        return createErrorResponse(err);
      }
      // eslint-disable-next-line no-console
      console.error("[API] Unhandled error:", err);
      return createErrorResponse(
        ApiError.internal(
          process.env.NODE_ENV === "development" && err instanceof Error
            ? err.message
            : "An unexpected error occurred",
        ),
      );
    }
  };
}
