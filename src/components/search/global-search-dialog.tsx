"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ListChecks, NotebookText, CheckSquare, PartyPopper, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGlobalSearch, type SearchResult } from "@/hooks/use-global-search";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<SearchResult["type"], typeof BookOpen> = {
  subject: BookOpen,
  assignment: ListChecks,
  note: NotebookText,
  task: CheckSquare,
  event: PartyPopper,
  exam: GraduationCap,
};

export function GlobalSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { query, setQuery, results, isSearching } = useGlobalSearch();

  function handleSelect(result: SearchResult) {
    router.push(result.href as never);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Search CampusTracker</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border/60 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, assignments, notes, tasks, events, exams…"
            className="h-12 border-none px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim().length < 2 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">Type at least 2 characters to search.</p>}
          {query.trim().length >= 2 && isSearching && <p className="px-3 py-6 text-center text-sm text-muted-foreground">Searching…</p>}
          {query.trim().length >= 2 && !isSearching && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results for &quot;{query}&quot;.</p>
          )}
          {results.map((result) => {
            const Icon = TYPE_ICON[result.type];
            return (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted")}
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{result.title}</span>
                {result.subtitle && <span className="text-xs text-muted-foreground">{result.subtitle}</span>}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
