"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface TimetableSettings {
  showWeekends: boolean;
}

const DEFAULTS: TimetableSettings = { showWeekends: false };

export function useTimetableSettings() {
  const { user } = useUser();
  const supabase = React.useMemo(() => createClient(), []);
  const [settings, setSettings] = React.useState<TimetableSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    supabase
      .from("user_preferences")
      .select("timetable_settings")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const stored = data?.timetable_settings as Partial<TimetableSettings> | null;
        setSettings({ ...DEFAULTS, ...stored });
        setIsLoading(false);
      });
  }, [user, supabase]);

  async function setShowWeekends(showWeekends: boolean) {
    setSettings((s) => ({ ...s, showWeekends }));
    if (!user) return;
    await supabase.from("user_preferences").update({ timetable_settings: { ...settings, showWeekends } }).eq("user_id", user.id);
  }

  return { settings, isLoading, setShowWeekends };
}
