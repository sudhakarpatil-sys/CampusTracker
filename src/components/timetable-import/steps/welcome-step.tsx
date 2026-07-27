"use client";

import { Sparkles, FileUp, CalendarClock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HIGHLIGHTS = [
  { icon: FileUp, text: "Upload one PDF or photo of your timetable" },
  { icon: Sparkles, text: "AI reads it and matches it to your semester" },
  { icon: CalendarClock, text: "Subjects and lectures are created automatically" },
  { icon: CheckCircle2, text: "Attendance tracking is ready the moment it's done" },
];

export function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <Card className="p-8 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Let&apos;s build your timetable
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        Upload your own division&apos;s timetable file and CampusTracker sets up your subjects, lectures,
        and attendance tracking — no manual entry required.
      </p>

      <div className="mx-auto mt-8 grid max-w-sm gap-3 text-left">
        {HIGHLIGHTS.map((item) => (
          <div
            key={item.text}
            className="margin-tab flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3"
          >
            <item.icon className="h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      <Button size="lg" className="mt-8" onClick={onContinue}>
        Get started
      </Button>
    </Card>
  );
}
