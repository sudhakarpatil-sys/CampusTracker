"use client";

import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTimetableSettings } from "@/hooks/use-timetable-settings";

export function WeekendToggle() {
  const { settings, setShowWeekends } = useTimetableSettings();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarRange className="h-3.5 w-3.5" /> Days
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show-weekends" className="text-sm">
              Show weekends
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">Add Saturday and Sunday to the grid.</p>
          </div>
          <Switch id="show-weekends" checked={settings.showWeekends} onCheckedChange={setShowWeekends} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
