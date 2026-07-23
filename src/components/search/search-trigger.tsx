"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearchDialog } from "@/components/search/global-search-dialog";

export function SearchTrigger() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button variant="outline" size="sm" className="hidden gap-2 text-muted-foreground sm:flex" onClick={() => setOpen(true)}>
        <Search className="h-3.5 w-3.5" />
        Search
        <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </Button>
      <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setOpen(true)} aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
      <GlobalSearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
