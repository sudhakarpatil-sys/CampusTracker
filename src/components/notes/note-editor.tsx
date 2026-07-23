"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, ImagePlus, Loader2, Paperclip, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SubjectSelect } from "@/components/shared/subject-select";
import { useNotes } from "@/hooks/use-notes";
import { useSubjects } from "@/hooks/use-subjects";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import type { Note } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

type Attachment = { name: string; url: string; type: string };

export function NoteEditor({ note }: { note: Note }) {
  const { user } = useUser();
  const { saveNote, deleteNote } = useNotes();
  const { subjects } = useSubjects();
  const [title, setTitle] = React.useState(note.title);
  const [content, setContent] = React.useState(note.content);
  const [subjectId, setSubjectId] = React.useState(note.subject_id ?? undefined);
  const [tab, setTab] = React.useState<"write" | "preview">("write");
  const [isUploading, setIsUploading] = React.useState(false);
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle");
  const attachments = (note.attachments as unknown as Attachment[]) ?? [];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset local state whenever a different note is opened.
  React.useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setSubjectId(note.subject_id ?? undefined);
  }, [note.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave: debounce 800ms after the user stops typing.
  React.useEffect(() => {
    if (title === note.title && content === note.content && subjectId === (note.subject_id ?? undefined)) return;
    setSaveState("saving");
    const handle = setTimeout(async () => {
      await saveNote(note.id, { title: title || "Untitled note", content, subjectId: subjectId ?? null });
      setSaveState("saved");
    }, 800);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, subjectId]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);
    const supabase = createClient();
    const path = `${user.id}/notes/${note.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("attachments").upload(path, file);

    if (error) {
      toast({ title: "Upload failed", description: error.message });
      setIsUploading(false);
      return;
    }

    const url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
    const nextAttachments = [...attachments, { name: file.name, url, type: file.type }];
    await supabase.from("notes").update({ attachments: nextAttachments }).eq("id", note.id);
    toast({ title: "Attachment added" });
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function removeAttachment(url: string) {
    const supabase = createClient();
    const nextAttachments = attachments.filter((a) => a.url !== url);
    await supabase.from("notes").update({ attachments: nextAttachments }).eq("id", note.id);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled note"
          className="max-w-sm border-none px-0 text-lg font-display font-semibold shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}
          </span>
          <div className="w-40">
            <SubjectSelect subjects={subjects} value={subjectId} onChange={setSubjectId} allowNone placeholder="No subject" />
          </div>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Delete this note?"
            description="This cannot be undone."
            onConfirm={() => deleteNote(note.id)}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border/60 px-4 py-2">
        <Button variant={tab === "write" ? "secondary" : "ghost"} size="sm" onClick={() => setTab("write")}>
          Write
        </Button>
        <Button variant={tab === "preview" ? "secondary" : "ghost"} size="sm" onClick={() => setTab("preview")}>
          Preview
        </Button>
        <div className="ml-auto">
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
            Attach
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "write" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write in Markdown — # headings, **bold**, `code`, ```code blocks```, ![alt](url) images…"
            className="h-full w-full resize-none border-none bg-transparent font-mono text-sm leading-relaxed focus:outline-none"
          />
        ) : (
          <article className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Nothing to preview yet.*"}</ReactMarkdown>
          </article>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="border-t border-border/60 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Attachments</p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((a) => (
              <div key={a.url} className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-xs">
                {a.type.startsWith("image/") ? <ImagePlus className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                <a href={a.url} target="_blank" rel="noreferrer" className="max-w-[140px] truncate hover:underline">
                  {a.name}
                </a>
                <button onClick={() => removeAttachment(a.url)} aria-label={`Remove ${a.name}`}>
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function NoteEditorSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
