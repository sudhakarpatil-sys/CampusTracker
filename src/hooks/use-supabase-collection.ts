"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import type { Database } from "@/types/database.types";

type TableName = keyof Database["public"]["Tables"];

interface UseCollectionOptions {
  table: TableName;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  /** Extra `.eq()` filters applied on every fetch, e.g. { is_archived: false }. */
  match?: Record<string, string | number | boolean>;
  /** Set false to skip the realtime subscription (rarely needed). */
  realtime?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────
// Retry configuration
// ─────────────────────────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Exponential backoff: 500ms → 1s → 2s.
 */
function getRetryDelay(attempt: number): number {
  return INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
}

/**
 * Wraps a promise with a timeout. Rejects if the promise doesn't
 * settle within `ms` milliseconds.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/**
 * Shared data-fetching core for every Phase 2 entity: loads the
 * current user's rows, keeps them in sync via a Supabase Realtime
 * channel (so edits from other tabs/devices — or optimistic writes here
 * — always converge), and exposes a manual `refetch` for after mutations.
 *
 * Phase 3C improvements:
 * - Exponential backoff retry (max 3 retries) for transient failures
 * - 10s timeout to prevent indefinite loading states
 *
 * Table-specific hooks (use-subjects, use-tasks, ...) wrap this with typed
 * CRUD helpers; this file intentionally stays untyped-at-the-edges (casts
 * to `T[]`) since PostgREST's generic `.select()` overloads can't narrow a
 * dynamic column-string per table without one bespoke generic per caller.
 */
export function useSupabaseCollection<T extends { id: string }>({
  table,
  select = "*",
  orderBy,
  match,
  realtime = true,
}: UseCollectionOptions) {
  const { user, isLoading: userLoading } = useUser();
  const supabase = React.useMemo(() => createClient(), []);
  const [data, setData] = React.useState<T[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const matchKey = match ? JSON.stringify(match) : "";

  const refetch = React.useCallback(async () => {
    // Auth state hasn't resolved yet — wait rather than briefly rendering
    // an empty/logged-out state that would immediately flip once the
    // real user loads a moment later.
    if (userLoading) return;

    if (!user) {
      setData([]);
      setIsLoading(false);
      return;
    }

    let lastError: string | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        let query: any = supabase.from(table).select(select); // eslint-disable-line
        query = query.eq("user_id", user.id);
        if (match) {
          for (const [key, value] of Object.entries(match)) {
            query = query.eq(key, value);
          }
        }
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        const result = await withTimeout<{ data: T[] | null; error: { message: string } | null }>(
          query,
          REQUEST_TIMEOUT_MS,
        );
        const { data: rows, error: queryError } = result;

        if (queryError) {
          lastError = queryError.message;
          // eslint-disable-next-line no-console
          console.error(`Failed to fetch "${table}" (attempt ${attempt + 1}):`, queryError.message);

          // Don't retry on auth/permission errors — they won't resolve on retry.
          if (queryError.message?.includes("JWT") || queryError.message?.includes("permission")) {
            break;
          }

          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, getRetryDelay(attempt)));
            continue;
          }
        } else {
          setError(null);
          setData((rows ?? []) as unknown as T[]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown error";
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch "${table}" (attempt ${attempt + 1}):`, lastError);

        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, getRetryDelay(attempt)));
          continue;
        }
      }
    }

    // All retries exhausted.
    setError(lastError);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading, supabase, table, select, orderBy?.column, orderBy?.ascending, matchKey]);

  React.useEffect(() => {
    setIsLoading(true);
    refetch();
  }, [refetch]);

  const instanceId = React.useId();

  React.useEffect(() => {
    if (!user || !realtime) return;
    const channel = supabase
      .channel(`${table}-${user.id}-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `user_id=eq.${user.id}` },
        () => {
          refetch();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, supabase, table, realtime]);

  return { data, setData, isLoading, error, refetch, supabase, userId: user?.id };
}
