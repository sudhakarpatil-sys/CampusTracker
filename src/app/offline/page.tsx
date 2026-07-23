"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold">No connection</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          CampusTracker needs an internet connection to sync your data. Offline mode with local caching is planned for a
          future release.
        </p>
      </div>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );
}
