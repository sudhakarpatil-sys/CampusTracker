"use client";

import * as React from "react";
import { Megaphone, Plus, Trash2, Send, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useEvents } from "@/hooks/use-events";
import { useFaculty } from "@/hooks/use-faculty";
import { formatDate } from "@/lib/utils";

export function FacultyAnnouncementsManagerContent() {
  const { events: announcements, isLoading, createEvent, deleteEvent } = useEvents();
  const { publishFacultyEvent } = useFaculty();

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<"college" | "workshop" | "hackathon" | "club" | "personal">("college");
  const [eventDate, setEventDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  async function handleCreate() {
    if (!title.trim()) return;
    setIsCreating(true);

    const targetDate: string = eventDate || new Date().toISOString().slice(0, 10);
    const res = await createEvent({
      title,
      category,
      eventDate: targetDate,
      description,
    });

    if (!res.error) {
      publishFacultyEvent("AnnouncementPublished", {
        title,
        category,
        eventDate,
      });

      setTitle("");
      setDescription("");
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
          Class & Course Announcements
        </h1>
        <p className="text-sm text-muted-foreground">
          Publish official notices, exam schedule changes, and academic updates to enrolled students.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="glass-shelf lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-amber-500" /> Post Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Title / Headline</label>
              <Input
                placeholder="e.g. Midterm Lab Exam Rescheduled to Friday"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Category</label>
              <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college" className="text-xs">College Official</SelectItem>
                  <SelectItem value="workshop" className="text-xs">Workshop / Seminar</SelectItem>
                  <SelectItem value="hackathon" className="text-xs">Hackathon / Competition</SelectItem>
                  <SelectItem value="club" className="text-xs">Club Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Announcement Date</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Details & Notice Message</label>
              <Textarea
                placeholder="Enter full notice text, venue details, or instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] text-xs"
              />
            </div>

            <Button
              onClick={handleCreate}
              disabled={isCreating || !title.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-indigo-600 text-white gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              {isCreating ? "Publishing..." : "Post Announcement"}
            </Button>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Active Announcements ({announcements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="No announcements posted"
                description="Post announcements to communicate updates to student dashboards and Smart Stack alerts."
              />
            ) : (
              <div className="space-y-3">
                {announcements.map((anc) => (
                  <div
                    key={anc.id}
                    className="flex flex-col gap-2 rounded-xl border border-border/60 p-4 transition-all hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-foreground">{anc.title}</h4>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono border-amber-500/30 text-amber-500">
                            {anc.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Posted: {formatDate(anc.event_date)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEvent(anc.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-500"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {anc.description && (
                      <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40">
                        {anc.description}
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
