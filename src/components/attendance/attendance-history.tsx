"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { History, Calendar, Search, Filter, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";
import { cn, formatDate } from "@/lib/utils";

const STATUS_CONFIG = {
  present: { label: "Present", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  absent: { label: "Absent", icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  cancelled: { label: "Cancelled", icon: MinusCircle, color: "text-slate-400", bg: "bg-slate-500/10" },
} as const;

/**
 * Attendance History — Date-filtered table of attendance records
 * with status badges, subject color coding, and search filtering.
 */
export function AttendanceHistory() {
  const { records } = useAttendance();
  const { subjects } = useSubjects();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);

  const subjectMap = React.useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const filtered = React.useMemo(() => {
    let result = [...records].sort(
      (a, b) => new Date(b.class_date).getTime() - new Date(a.class_date).getTime()
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        const subject = subjectMap.get(r.subject_id);
        return (
          subject?.name.toLowerCase().includes(q) ||
          subject?.code?.toLowerCase().includes(q) ||
          r.class_date.includes(q)
        );
      });
    }

    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    return result;
  }, [records, search, statusFilter, subjectMap]);

  // Group by date for cleaner display
  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((r) => {
      const list = map.get(r.class_date) ?? [];
      list.push(r);
      map.set(r.class_date, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by subject or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            All
          </Button>
          {(Object.keys(STATUS_CONFIG) as (keyof typeof STATUS_CONFIG)[]).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="gap-1.5"
            >
              {React.createElement(STATUS_CONFIG[s].icon, { className: cn("h-3 w-3", STATUS_CONFIG[s].color) })}
              {STATUS_CONFIG[s].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      {grouped.length === 0 ? (
        <EmptyState
          icon={History}
          title="No records found"
          description={search ? "Try adjusting your search." : "Mark attendance to see your history here."}
        />
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, records], groupIdx) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(groupIdx * 0.04, 0.2) }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  {formatDate(date)}
                </p>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {records.length}
                </Badge>
              </div>

              <div className="space-y-1.5">
                {records.map((record) => {
                  const subject = subjectMap.get(record.subject_id);
                  const config = STATUS_CONFIG[record.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.cancelled;
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={record.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2.5 transition-colors hover:bg-muted/30"
                      )}
                    >
                      {/* Subject color dot */}
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: subject?.color || "#5B7FFF" }}
                      />

                      {/* Subject info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {subject?.name ?? "Unknown"}
                        </p>
                        {subject?.code && (
                          <p className="text-[11px] text-muted-foreground">{subject.code}</p>
                        )}
                      </div>

                      {/* Status badge */}
                      <div className={cn("flex items-center gap-1.5 rounded-md px-2 py-1", config.bg)}>
                        <StatusIcon className={cn("h-3 w-3", config.color)} />
                        <span className={cn("text-[11px] font-medium", config.color)}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
