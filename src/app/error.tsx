"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  // Classify the error for a more helpful message.
  const isNetworkError = error.message?.toLowerCase().includes("fetch") || error.message?.toLowerCase().includes("network");
  const isAuthError = error.message?.toLowerCase().includes("auth") || error.message?.toLowerCase().includes("session");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <p className="font-mono text-sm text-muted-foreground">500</p>
        <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {isNetworkError
            ? "Looks like a network issue. Check your connection and try again."
            : isAuthError
              ? "Your session may have expired. Try refreshing the page or signing in again."
              : "We hit an unexpected error on our end. Nothing on your account was affected — try again."}
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()} data-testid="error-retry-button">
          <RefreshCw className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <a href="/" data-testid="error-home-button">
            <Home className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Back home
          </a>
        </Button>
      </div>
    </div>
  );
}
