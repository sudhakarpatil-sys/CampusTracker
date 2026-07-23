import { NotesList } from "@/components/notes/notes-list";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 flex h-[calc(100vh-4rem)]">
      <div className="w-72 shrink-0">
        <NotesList />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
