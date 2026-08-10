"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, User, BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTimetable } from "@/hooks/use-timetable";
import { useSubjects } from "@/hooks/use-subjects";
import { todayISODay, timeToMinutes, formatTime } from "@/lib/academic";
import { cn } from "@/lib/utils";

/**
 * Current Class Card — Prominent card showing the current or next class
 * with subject, faculty, room, and time remaining countdown.
 */
export function CurrentClassCard() {
  const { slotsForDay } = useTimetable();
  const { subjects } = useSubjects();
  const [now, setNow] = React.useState(new Date());

  // Update every minute
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const todaySlots = slotsForDay(todayISODay(now));
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  // Find current class (within start-end window)
  const currentSlot = todaySlots.find((slot) => {
    const start = timeToMinutes(slot.start_time);
    const end = timeToMinutes(slot.end_time);
    return currentMinutes >= start && currentMinutes < end;
  });

  // Find next class (start time > now)
  const nextSlot = todaySlots.find((slot) => {
    const start = timeToMinutes(slot.start_time);
    return start > currentMinutes;
  });

  const activeSlot = currentSlot || nextSlot;
  const isCurrent = !!currentSlot;

  if (!activeSlot) {
    // No more classes today
    if (todaySlots.length === 0) return null;

    return (
      <Card className="glass-shelf border-border/50">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">All done for today!</p>
            <p className="text-xs text-muted-foreground">
              You had {todaySlots.length} class{todaySlots.length !== 1 ? "es" : ""} today.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subject = subjectMap.get(activeSlot.subject_id);
  const slotStart = timeToMinutes(activeSlot.start_time);
  const slotEnd = timeToMinutes(activeSlot.end_time);

  const timeRemaining = isCurrent
    ? slotEnd - currentMinutes
    : slotStart - currentMinutes;

  const hours = Math.floor(timeRemaining / 60);
  const minutes = timeRemaining % 60;
  const timeStr =
    hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes}m`;

  // Progress for current class
  const progress = isCurrent
    ? ((currentMinutes - slotStart) / (slotEnd - slotStart)) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-0",
          isCurrent
            ? "bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent"
            : "bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent"
        )}
      >
        {/* Progress bar for current class */}
        {isCurrent && (
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-muted/50">
            <motion.div
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        )}

        <CardContent className="flex items-center gap-4 py-4">
          {/* Subject color accent */}
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              isCurrent ? "bg-indigo-500/20" : "bg-sky-500/15"
            )}
          >
            <BookOpen
              className={cn(
                "h-6 w-6",
                isCurrent ? "text-indigo-500" : "text-sky-500"
              )}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "px-2 py-0 text-[10px]",
                  isCurrent
                    ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                    : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                )}
              >
                {isCurrent ? "NOW" : "UP NEXT"}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">
              {subject?.name ?? "Class"}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(activeSlot.start_time)} — {formatTime(activeSlot.end_time)}
              </span>
              {activeSlot.classroom && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {activeSlot.classroom}
                </span>
              )}
              {activeSlot.faculty_name && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {activeSlot.faculty_name}
                </span>
              )}
            </div>
          </div>

          {/* Countdown */}
          <div className="shrink-0 text-right">
            <p
              className={cn(
                "text-lg font-bold font-mono",
                isCurrent ? "text-indigo-600 dark:text-indigo-400" : "text-sky-600 dark:text-sky-400"
              )}
            >
              {timeStr}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {isCurrent ? "remaining" : "until start"}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
