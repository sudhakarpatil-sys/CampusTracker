"use client";

import { Bell, CheckCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDate, cn } from "@/lib/utils";

const TYPE_DOT: Record<string, string> = {
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
};

export function NotificationPanel() {
  const { notifications, unreadCount, isLoading, markAllRead } = useNotifications();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-accent" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex-row items-center justify-between space-y-0">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-1 text-xs">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-2">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}

          {!isLoading && notifications.length === 0 && (
            <EmptyState icon={Bell} title="You're all caught up" description="New notifications will show up here." />
          )}

          {!isLoading &&
            notifications.map((n) => (
              <div key={n.id} className={cn("rounded-lg border border-border p-3", !n.read && "bg-muted/60")}>
                <div className="flex items-start gap-2.5">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", TYPE_DOT[n.type] ?? "bg-primary")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      {!n.read && (
                        <Badge variant="accent" className="shrink-0 px-1.5 py-0 text-[10px]">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{formatDate(n.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
