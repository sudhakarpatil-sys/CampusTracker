"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/shared/theme-provider";
import { useTimetableSettings } from "@/hooks/use-timetable-settings";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun, preview: "bg-[#f7f5f0]" },
  { value: "dark", label: "Dark", icon: Moon, preview: "bg-[#0b0e14]" },
  { value: "system", label: "System", icon: Laptop, preview: "bg-gradient-to-br from-[#f7f5f0] to-[#0b0e14]" },
] as const;

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const { settings, setShowWeekends } = useTimetableSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how CampusTracker looks. Your preference is saved to this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {OPTIONS.map((option) => {
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "relative rounded-xl border-2 p-4 text-left transition-colors",
                    isActive ? "border-accent" : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  <div className={cn("mb-3 h-16 w-full rounded-md border border-border/60", option.preview)} />
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </span>
                    {isActive && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timetable</CardTitle>
          <CardDescription>Controls what shows up on your Timetable and Today&apos;s Schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekends-toggle" className="text-sm">
                Show Saturday and Sunday
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">Off by default — most timetables only run Monday to Friday.</p>
            </div>
            <Switch id="weekends-toggle" checked={settings.showWeekends} onCheckedChange={setShowWeekends} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
