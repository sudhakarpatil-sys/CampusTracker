"use client";

import * as React from "react";
import { FileText, Plus, Trash2, Edit3, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotes } from "@/hooks/use-notes";
import { useFaculty } from "@/hooks/use-faculty";
import { formatDate } from "@/lib/utils";

export function FacultyNotesManagerContent() {
  const { notes, isLoading, createNote, deleteNote } = useNotes();
  const { assignedSubjects, publishFacultyEvent } = useFaculty();

  const [title, setTitle] = React.useState("");
  const [subjectId, setSubjectId] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  async function handleCreate() {
    if (!title.trim()) return;
    setIsCreating(true);

    const res = await createNote({
      title,
      subjectId: subjectId || undefined,
      content,
    });

    if (!res.error) {
      // Publish event to AcademicEventBus
      publishFacultyEvent("NotesUploaded", {
        noteId: res.id,
        title,
        subjectId,
      });

      setTitle("");
      setSubjectId("");
      setContent("");
    }
    setIsCreating(false);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Academic Notes & Learning Materials
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload and publish course notes, lecture slides, and study guides for student access.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Note Form */}
        <Card className="glass-shelf lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-violet-500" /> Publish New Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Note Title</label>
              <Input
                placeholder="e.g. Unit 3 — Database Indexing & B-Trees"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Subject</label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  {assignedSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.name} ({s.code || "CS"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Content / Outline</label>
              <Textarea
                placeholder="Enter lecture content outline, reference links, or study notes..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] text-xs"
              />
            </div>

            <Button
              onClick={handleCreate}
              disabled={isCreating || !title.trim()}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              {isCreating ? "Publishing..." : "Publish & Notify Students"}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Notes List */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Published Notes ({notes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No notes published yet"
                description="Use the form to create and share study materials with your classes."
              />
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex flex-col gap-2 rounded-xl border border-border/60 p-4 transition-all hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{note.title}</h4>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Published {formatDate(note.created_at)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-500"
                        title="Delete Note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {note.content && (
                      <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                        {note.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
