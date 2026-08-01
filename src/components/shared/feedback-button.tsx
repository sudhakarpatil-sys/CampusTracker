"use client";

import * as React from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/shared/feedback-dialog";
import { cn } from "@/lib/utils";

/**
 * Persistent floating button that opens the feedback dialog.
 * Positioned bottom-right, avoiding overlap with mobile nav areas.
 */
export function FeedbackButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg",
          "bg-accent hover:bg-accent/90 text-accent-foreground",
          "transition-all duration-200 hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        )}
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        data-testid="feedback-button"
      >
        <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
      </Button>

      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
