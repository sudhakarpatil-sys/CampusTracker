"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppNotification } from "@/types/database.types";
import { useUser } from "@/hooks/use-user";

const PLACEHOLDER_NOTIFICATIONS: AppNotification[] = [
  {
    id: "placeholder-1",
    user_id: "placeholder",
    title: "Welcome to CampusTracker",
    message: "Finish setting up your profile to personalize your dashboard.",
    type: "info",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "placeholder-2",
    user_id: "placeholder",
    title: "Attendance tracking is on the way",
    message: "Phase 2 will let you log classes and see live percentages here.",
    type: "info",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "placeholder-3",
    user_id: "placeholder",
    title: "Theme preference saved",
    message: "You can change it any time from Settings → Appearance.",
    type: "success",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

/**
 * Reads real rows from the `notifications` table (RLS-scoped to the
 * current user). Falls back to placeholder content when the table is
 * empty, which is expected in Phase 1 since nothing writes to it yet.
 */
export function useNotifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [isPlaceholder, setIsPlaceholder] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setNotifications(data);
          setIsPlaceholder(false);
        } else {
          setNotifications(PLACEHOLDER_NOTIFICATIONS);
          setIsPlaceholder(true);
        }
        setIsLoading(false);
      });
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (isPlaceholder || !user) return;
    const supabase = createClient();
    supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false).then();
  }, [isPlaceholder, user]);

  return { notifications, unreadCount, isLoading, isPlaceholder, markAllRead };
}
