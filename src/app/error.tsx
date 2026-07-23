"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-2">
        <p className="font-mono text-sm text-muted-foreground">500</p>
        <h1 className="font-display text-3xl font-semibold">Something went wrong</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          We hit an unexpected error on our end. Nothing on your account was affected — try again.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <a href="/">Back home</a>
        </Button>
      </div>
    </div>
  );
}
