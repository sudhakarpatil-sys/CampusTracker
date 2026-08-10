"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Megaphone, Pin, Clock, Tag, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/use-events";
import { formatDate, cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  college: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  workshop: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  hackathon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  club: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  personal: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
};

/**
 * Announcements List — Renders events as announcements in a timeline format.
 * Uses the existing `events` table with category-based styling.
 * Realtime-ready via the useEvents hook's Supabase channel subscription.
 */
export function AnnouncementsList() {
  const { events, isLoading } = useEvents();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = React.useMemo(() => {
    const cats = new Set(events.map((e) => e.category));
    return Array.from(cats);
  }, [events]);

  const filtered = React.useMemo(() => {
    let result = [...events].sort(
      (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }

    return result;
  }, [events, search, selectedCategory]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements"
          description={search ? "Try adjusting your search." : "Announcements will appear here when published."}
        />
      ) : (
        <div className="relative space-y-4">
          {/* Timeline vertical line */}
          <div className="absolute left-5 top-4 bottom-4 hidden w-px bg-border/60 sm:block" />

          {filtered.map((announcement, idx) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.04, 0.3) }}
            >
              <Card className="glass-shelf relative overflow-hidden sm:ml-10">
                {/* Timeline dot */}
                <div className="absolute -left-[29px] top-6 hidden h-3 w-3 rounded-full border-2 border-background bg-indigo-500 sm:block" />

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-sm font-semibold text-foreground">
                          {announcement.title}
                        </h3>
                        <Badge
                          className={cn(
                            "shrink-0 px-2 py-0 text-[10px] capitalize",
                            CATEGORY_COLORS[announcement.category] ?? "bg-muted text-muted-foreground"
                          )}
                        >
                          {announcement.category}
                        </Badge>
                      </div>

                      {announcement.description && (
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {announcement.description}
                        </p>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/70">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(announcement.event_date)}
                        </span>
                        {announcement.location && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {announcement.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
