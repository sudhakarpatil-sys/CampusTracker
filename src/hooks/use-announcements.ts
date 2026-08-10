"use client";

import * as React from "react";
import { useEvents } from "@/hooks/use-events";
import type { CalendarEvent } from "@/types/database.types";

export interface Announcement extends CalendarEvent {
  isPinned?: boolean;
}

/**
 * Hook wrapping useEvents with announcement-specific helpers.
 * Uses the existing `events` table — announcements are events filtered/sorted
 * with additional category-aware logic and pinning support.
 */
export function useAnnouncements() {
  const { events, isLoading, createEvent, updateEvent, deleteEvent, refetch } = useEvents();

  // Sort: most recent first, "college" category events treated as higher priority
  const announcements: Announcement[] = React.useMemo(() => {
    return [...events]
      .sort((a, b) => {
        // College events (institutional) are treated as higher priority
        const aPriority = a.category === "college" ? 1 : 0;
        const bPriority = b.category === "college" ? 1 : 0;
        if (aPriority !== bPriority) return bPriority - aPriority;
        return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
      })
      .map((e) => ({
        ...e,
        isPinned: e.category === "college",
      }));
  }, [events]);

  const pinned = React.useMemo(() => announcements.filter((a) => a.isPinned), [announcements]);

  const categories = React.useMemo(() => {
    const cats = new Set(events.map((e) => e.category));
    return Array.from(cats);
  }, [events]);

  const recentCount = React.useMemo(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return events.filter((e) => new Date(e.event_date) >= threeDaysAgo).length;
  }, [events]);

  return {
    announcements,
    pinned,
    categories,
    recentCount,
    isLoading,
    createAnnouncement: createEvent,
    updateAnnouncement: updateEvent,
    deleteAnnouncement: deleteEvent,
    refetch,
  };
}
