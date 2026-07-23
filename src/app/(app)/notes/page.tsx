import type { Metadata } from "next";
import { NotebookText } from "lucide-react";

export const metadata: Metadata = { title: "Notes" };

export default function NotesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <NotebookText className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="font-display font-semibold">Select a note</p>
        <p className="text-sm text-muted-foreground">Or create a new one from the sidebar.</p>
      </div>
    </div>
  );
}
