"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import type { TimetableImportItem } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

export function useTimetableImportItems(importId: string | null) {
  const supabase = React.useMemo(() => createClient(), []);
  const [items, setItems] = React.useState<TimetableImportItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchItems = React.useCallback(async () => {
    if (!importId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("timetable_import_items")
      .select("*")
      .eq("import_id", importId)
      .order("day_of_week", { ascending: true, nullsFirst: false })
      .order("start_time", { ascending: true });

    if (error) {
      toast({ title: "Couldn't load timetable items", description: error.message });
    } else {
      setItems((data ?? []) as TimetableImportItem[]);
    }
    setIsLoading(false);
  }, [importId, supabase]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Realtime, reusing the publication already enabled in the Milestone 1
  // migration — reflects edits instantly if the same import is open
  // elsewhere.
  React.useEffect(() => {
    if (!importId) return;
    const channel = supabase
      .channel(`timetable_import_items:${importId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "timetable_import_items", filter: `import_id=eq.${importId}` },
        () => fetchItems()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [importId, supabase, fetchItems]);

  async function updateItem(itemId: string, patch: Partial<TimetableImportItem>) {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)));
    const { error } = await supabase.from("timetable_import_items").update(patch as never).eq("id", itemId);
    if (error) {
      toast({ title: "Couldn't save that change", description: error.message });
      fetchItems();
    }
  }

  return { items, isLoading, updateItem, refetch: fetchItems };
}
