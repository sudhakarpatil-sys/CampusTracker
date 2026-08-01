import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────
// Reusable skeleton patterns for loading states.
// These match the real layout dimensions so content doesn't "jump" on load.
// ─────────────────────────────────────────────────────────────────────────

/** Full-page skeleton matching the dashboard hero + metrics + grid layout. */
export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)} data-testid="page-skeleton">
      {/* Hero area */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      {/* Content grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Card / widget skeleton — matches WidgetShell dimensions. */
export function CardSkeleton({ className }: { className?: string } = {}) {
  return (
    <div
      className={cn("rounded-xl border border-border/60 bg-card p-5 space-y-3", className)}
      data-testid="card-skeleton"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Table row skeleton for list views. */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} data-testid="table-skeleton">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4">
          {Array.from({ length: columns }).map((_, col) => (
            <Skeleton key={col} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Single-line skeleton for inline content. */
export function InlineSkeleton({ width = "w-24" }: { width?: string }) {
  return <Skeleton className={`h-4 ${width} inline-block`} />;
}

/** Timetable grid skeleton. */
export function TimetableGridSkeleton() {
  return (
    <div className="space-y-4" data-testid="timetable-skeleton">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {/* Day headers */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-8" />
        ))}
        {/* Time slots */}
        {Array.from({ length: 30 }).map((_, i) => (
          <Skeleton key={`s-${i}`} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/** Kanban board skeleton for assignments. */
export function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" data-testid="kanban-skeleton">
      {Array.from({ length: 4 }).map((_, col) => (
        <div key={col} className="space-y-3">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 3 }).map((_, row) => (
            <Skeleton key={row} className="h-28 rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}
