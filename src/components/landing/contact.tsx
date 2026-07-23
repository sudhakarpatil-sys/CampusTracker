"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Wire this up to a support inbox or ticketing system when ready.
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Message sent", description: "We'll get back to you within a day or two." });
      e.currentTarget.reset();
    }, 700);
  }

  return (
    <section className="border-t border-border/60 py-20">
      <div className="container max-w-xl">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">Have a question or idea?</h2>
          <p className="mt-2 text-muted-foreground">Tell us what would make CampusTracker better for your semester.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-6">
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" type="email" placeholder="you@college.edu" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-message">Message</Label>
            <textarea
              id="contact-message"
              required
              rows={4}
              placeholder="What's on your mind?"
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
