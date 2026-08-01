"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Fallback UI to show when an error occurs. If omitted, a default card is used. */
  fallback?: React.ReactNode;
  /** Custom fallback render function with access to the error and a retry callback. */
  fallbackRender?: (props: { error: Error; reset: () => void }) => React.ReactNode;
  /** Called when an error is caught. Use for logging/reporting. */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Optional CSS class for the fallback wrapper. */
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable error boundary for isolating component failures.
 *
 * Use around widgets, panels, or any subtree that should degrade
 * gracefully without taking down the entire page.
 *
 * ```tsx
 * <ErrorBoundary onError={(e) => logToService(e)}>
 *   <AttendanceWidget />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom render function takes priority.
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({ error: this.state.error, reset: this.reset });
      }

      // Static fallback.
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback card.
      return <ErrorFallback error={this.state.error} reset={this.reset} className={this.props.className} />;
    }

    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Default fallback UI — matches the existing app error.tsx aesthetic.
// ─────────────────────────────────────────────────────────────────────────

function ErrorFallback({
  error,
  reset,
  className,
}: {
  error: Error;
  reset: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-8 text-center",
        className,
      )}
      role="alert"
      data-testid="error-boundary-fallback"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {process.env.NODE_ENV === "development" ? error.message : "This section couldn't load. Try again."}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={reset} data-testid="error-boundary-retry">
        <RefreshCw className="mr-1.5 h-3 w-3" aria-hidden="true" />
        Retry
      </Button>
    </div>
  );
}
