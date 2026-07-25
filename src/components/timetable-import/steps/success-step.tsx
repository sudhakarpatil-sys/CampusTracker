"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SuccessStepProps {
  subjectsCreated: number;
  slotsCreated: number;
}

export function SuccessStep({ subjectsCreated, slotsCreated }: SuccessStepProps) {
  return (
    <Card className="p-8 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
        <PartyPopper className="h-6 w-6" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight">Your timetable is imported</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {subjectsCreated > 0 && <>{subjectsCreated} new subject{subjectsCreated === 1 ? "" : "s"} and </>}
        {slotsCreated} lecture{slotsCreated === 1 ? "" : "s"} are on your timetable. Attendance tracking is ready
        right now.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/timetable">View timetable</Link>
        </Button>
        <Button asChild>
          <Link href="/attendance">Take attendance</Link>
        </Button>
      </div>
    </Card>
  );
}
