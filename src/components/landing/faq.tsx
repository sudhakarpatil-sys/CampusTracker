"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is CampusTracker free to use?",
    a: "Yes. The core experience — attendance, assignments, timetable, notes, and dashboard — is free. Premium plans with extras like OCR assignment scanning are planned for later.",
  },
  {
    q: "Is my academic data private?",
    a: "Yes. Every table is protected with Postgres Row Level Security, so only you can ever read or write your own records — not other students, not us.",
  },
  {
    q: "Which features are live in this release?",
    a: "Phase 1 ships the account system, onboarding, dashboard framework, and navigation. Attendance, assignments, and the rest are structured and ready, arriving in upcoming phases.",
  },
  {
    q: "Can I use it on my phone?",
    a: "The web app is fully responsive today. A installable PWA with offline support is on the roadmap.",
  },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-border/60 bg-surface/40 py-20">
      <div className="container max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Questions</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Frequently asked</h2>
        </div>

        <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-surface">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && <p className="px-5 pb-4 text-sm text-muted-foreground">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
