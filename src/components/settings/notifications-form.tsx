"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const PREFERENCES = [
  { key: "assignmentReminders", label: "Assignment reminders", description: "Get notified before deadlines." },
  { key: "attendanceAlerts", label: "Attendance alerts", description: "Warn me when a subject's attendance drops near the cutoff." },
  { key: "examCountdowns", label: "Exam countdowns", description: "Daily reminders as exams approach." },
  { key: "productWeekly", label: "Weekly summary", description: "A recap of your week every Sunday evening." },
  { key: "productUpdates", label: "Product updates", description: "Occasional emails about new CampusTracker features." },
] as const;

/**
 * UI-only for Phase 1 — wire each toggle to `user_preferences.notification_prefs`
 * once the notifications table has real writers.
 */
export function NotificationsForm() {
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({
    assignmentReminders: true,
    attendanceAlerts: true,
    examCountdowns: true,
    productWeekly: false,
    productUpdates: true,
  });

  function toggle(key: string) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast({ title: "Preference saved" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what CampusTracker should notify you about.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {PREFERENCES.map((pref, i) => (
          <React.Fragment key={pref.key}>
            <div className="flex items-center justify-between py-3">
              <div className="pr-6">
                <Label htmlFor={pref.key} className="text-sm">
                  {pref.label}
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <Switch id={pref.key} checked={prefs[pref.key]} onCheckedChange={() => toggle(pref.key)} />
            </div>
            {i < PREFERENCES.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
