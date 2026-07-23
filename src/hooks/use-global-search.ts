"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

export interface SearchResult {
  id: string;
  type: "subject" | "assignment" | "note" | "task" | "event" | "exam";
  title: string;
  subtitle?: string;
  href: string;
}

/** Debounced instant search across every Phase 2 entity for the current user. */
export function useGlobalSearch() {
  const { user } = useUser();
  const supabase = React.useMemo(() => createClient(), []);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    if (!user || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      setIsSearching(true);
      const term = `%${query.trim()}%`;

      const [subjects, assignments, notes, tasks, events, exams] = await Promise.all([
        supabase.from("subjects").select("id,name").eq("user_id", user.id).ilike("name", term).limit(5),
        supabase.from("assignments").select("id,title").eq("user_id", user.id).ilike("title", term).limit(5),
        supabase.from("notes").select("id,title").eq("user_id", user.id).ilike("title", term).limit(5),
        supabase.from("tasks").select("id,title").eq("user_id", user.id).ilike("title", term).limit(5),
        supabase.from("events").select("id,title").eq("user_id", user.id).ilike("title", term).limit(5),
        supabase.from("exams").select("id,syllabus").eq("user_id", user.id).ilike("syllabus", term).limit(5),
      ]);

      const combined: SearchResult[] = [
        ...(subjects.data ?? []).map((s) => ({ id: s.id, type: "subject" as const, title: s.name, href: "/subjects" })),
        ...(assignments.data ?? []).map((a) => ({
          id: a.id,
          type: "assignment" as const,
          title: a.title,
          subtitle: "Assignment",
          href: "/assignments",
        })),
        ...(notes.data ?? []).map((n) => ({ id: n.id, type: "note" as const, title: n.title, subtitle: "Note", href: `/notes/${n.id}` })),
        ...(tasks.data ?? []).map((t) => ({ id: t.id, type: "task" as const, title: t.title, subtitle: "Task", href: "/tasks" })),
        ...(events.data ?? []).map((e) => ({ id: e.id, type: "event" as const, title: e.title, subtitle: "Event", href: "/events" })),
        ...(exams.data ?? []).map((e) => ({
          id: e.id,
          type: "exam" as const,
          title: e.syllabus || "Exam",
          subtitle: "Exam",
          href: "/exams",
        })),
      ];

      setResults(combined);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(handle);
  }, [query, user, supabase]);

  return { query, setQuery, results, isSearching };
}
