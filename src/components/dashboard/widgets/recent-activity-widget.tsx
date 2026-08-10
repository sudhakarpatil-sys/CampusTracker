"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CalendarCheck2,
  BookOpen,
  FileText,
  Bell,
  GraduationCap,
} from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDate, cn } from "@/lib/utils";

const ACTIVITY_ICONS: Record<string, typeof Activity> = {
  info: Bell,
  success: CalendarCheck2,
  warning: BookOpen,
  error: GraduationCap,
};

/**
 * Recent Activity Widget — shows the latest notifications/events
 * as a timeline. In the future, this will consume Academic Event Bus
 * domain events directly.
 */
export function RecentActivityWidget(props: {
  onHide?: () => void;
  draggableProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  const { notifications } = useNotifications();

  const recent = notifications.slice(0, 6);

  return (
    <WidgetShell title="Recent Activity" icon={Activity} {...props}>
      {recent.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No recent activity. Actions will appear here as you use CampusTracker.
        </p>
      ) : (
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/60" />

          {recent.map((notification, idx) => {
            const Icon = ACTIVITY_ICONS[notification.type] ?? Activity;
            const dotColor =
              notification.type === "success"
                ? "bg-emerald-500"
                : notification.type === "warning"
                  ? "bg-amber-500"
                  : notification.type === "error"
                    ? "bg-rose-500"
                    : "bg-indigo-500";

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="relative flex items-start gap-3 py-2"
              >
                <div
                  className={cn(
                    "relative z-10 mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-background",
                    dotColor
                  )}
                >
                  <Icon className="h-2.5 w-2.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    {notification.title}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                    {formatDate(notification.created_at, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </WidgetShell>
  );
}
