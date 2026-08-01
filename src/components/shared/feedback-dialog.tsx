"use client";

import * as React from "react";
import { Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notification-service";

const CATEGORIES = [
  { value: "bug", label: "🐛 Bug Report" },
  { value: "feature", label: "💡 Feature Request" },
  { value: "ui_ux", label: "🎨 UI / UX" },
  { value: "performance", label: "⚡ Performance" },
  { value: "general", label: "💬 General Feedback" },
] as const;

type FeedbackCategory = (typeof CATEGORIES)[number]["value"];

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [category, setCategory] = React.useState<FeedbackCategory>("general");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const canSubmit = description.trim().length >= 10;

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        category,
        description: description.trim(),
        pageUrl: window.location.href,
        browserInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
        },
        deviceInfo: {
          platform: navigator.platform,
          touchPoints: navigator.maxTouchPoints,
          pixelRatio: window.devicePixelRatio,
        },
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || "Failed to submit feedback");
      }

      notify.success("Thanks for your feedback!", "We'll review it soon.");
      setDescription("");
      setCategory("general");
      onOpenChange(false);
    } catch (err) {
      notify.error("Couldn't submit feedback", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]" data-testid="feedback-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Send Feedback</DialogTitle>
          <DialogDescription>
            Found a bug? Have an idea? We&apos;d love to hear from you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="feedback-category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as FeedbackCategory)}>
              <SelectTrigger id="feedback-category" data-testid="feedback-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="feedback-description">Description</Label>
            <Textarea
              id="feedback-description"
              placeholder="Describe the issue or share your idea... (min. 10 characters)"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={5}
              maxLength={5000}
              data-testid="feedback-description"
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length} / 5,000
            </p>
          </div>

          {/* Auto-captured context notice */}
          <p className="text-xs text-muted-foreground">
            We&apos;ll automatically include your current page URL and browser info to help us diagnose issues.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="feedback-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} data-testid="feedback-submit">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <Send className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Send Feedback
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
