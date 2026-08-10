"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Inbox, Filter, AlertCircle, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDate, cn } from "@/lib/utils";

const TYPE_ICON: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const TYPE_COLOR: Record<string, string> = {
  info: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  error: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

/**
 * Full-page Notification Center with tabs for All, Unread, and category filtering.
 * Supports read/unread visual distinction and bulk mark-all-read.
 */
export function NotificationCenter() {
  const { notifications, unreadCount, isLoading, markAllRead } = useNotifications();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "You're all caught up!"
        }
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-1.5">
            <Inbox className="h-3.5 w-3.5" />
            All
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] font-mono">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Unread
            {unreadCount > 0 && (
              <Badge variant="accent" className="ml-1 px-1.5 py-0 text-[10px] font-mono">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <NotificationList items={notifications} />
        </TabsContent>
        <TabsContent value="unread">
          <NotificationList items={unread} emptyMessage="No unread notifications." />
        </TabsContent>
        <TabsContent value="academic">
          <NotificationList
            items={notifications.filter((n) => n.type === "success" || n.type === "info")}
            emptyMessage="No academic notifications."
          />
        </TabsContent>
        <TabsContent value="system">
          <NotificationList
            items={notifications.filter((n) => n.type === "warning" || n.type === "error")}
            emptyMessage="No system notifications."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationList({
  items,
  emptyMessage = "No notifications yet.",
}: {
  items: ReturnType<typeof useNotifications>["notifications"];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="You're all caught up"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="space-y-2">
      {items.map((notification, idx) => {
        const Icon = TYPE_ICON[notification.type] ?? Info;
        const colorClass = TYPE_COLOR[notification.type] ?? TYPE_COLOR.info;

        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.03, 0.25) }}
          >
            <Card
              className={cn(
                "glass-shelf p-4 transition-all duration-200",
                !notification.read && "border-l-2 border-l-indigo-500 bg-indigo-500/5"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    colorClass
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <Badge variant="accent" className="shrink-0 px-1.5 py-0 text-[10px]">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground/60">
                    {formatDate(notification.created_at, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
