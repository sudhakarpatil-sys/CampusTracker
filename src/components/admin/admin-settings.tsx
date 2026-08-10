"use client";

import * as React from "react";
import { Settings, ShieldCheck, Bell, RefreshCw, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export function AdminSettingsContent() {
  const [maxRetries, setMaxRetries] = React.useState("5");
  const [rateLimitPerMin, setRateLimitPerMin] = React.useState("60");
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSave() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Admin settings saved", description: "Global sync engine rules updated." });
    setIsSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Admin Console Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Sync engine rate limiting, retry queue policies, and global notification triggers.
        </p>
      </div>

      <Card className="glass-shelf max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4 text-indigo-500" /> Sync Engine Policy Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-foreground">Maximum Sync Job Retries</label>
            <Input
              type="number"
              value={maxRetries}
              onChange={(e) => setMaxRetries(e.target.value)}
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Number of automatic retry attempts before marking job abandoned.</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">Google Sheets API Rate Limit (Requests / Min)</label>
            <Input
              type="number"
              value={rateLimitPerMin}
              onChange={(e) => setRateLimitPerMin(e.target.value)}
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Prevents HTTP 429 Rate Limited responses during concurrent poll cycles.</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 text-xs gap-1.5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
