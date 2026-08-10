"use client";

import * as React from "react";
import { Settings, Bell, Shield, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function FacultySettingsViewContent() {
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSave() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Settings saved", description: "Faculty preferences updated." });
    setIsSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Faculty Console Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage publication alert triggers, theme preferences, and notification defaults.
        </p>
      </div>

      <Card className="glass-shelf max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4 text-violet-500" /> Preferences & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-muted/20">
            <div>
              <p className="font-semibold text-foreground">Auto-notify students on note publish</p>
              <p className="text-[11px] text-muted-foreground">Dispatches Event Bus alerts whenever a new note or slide deck is uploaded.</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs font-mono">
              Enabled
            </Button>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white h-9 text-xs gap-1.5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
