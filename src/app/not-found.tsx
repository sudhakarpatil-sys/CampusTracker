import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Compass className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="font-display text-3xl font-semibold">This page wandered off campus</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          The link might be broken, or the page may have moved. Let&apos;s get you back to familiar ground.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
