"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eventSchema, type EventInput } from "@/lib/validations/academic";
import { EVENT_CATEGORIES } from "@/lib/constants";
import type { CalendarEvent } from "@/types/database.types";

interface EventFormDialogProps {
  event?: CalendarEvent;
  trigger: React.ReactNode;
  onSubmit: (input: EventInput) => Promise<{ error: string | null } | void>;
}

export function EventFormDialog({ event, trigger, onSubmit }: EventFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description ?? "",
          category: event.category,
          eventDate: event.event_date,
          startTime: event.start_time?.slice(0, 5) ?? "",
          endTime: event.end_time?.slice(0, 5) ?? "",
          location: event.location ?? "",
        }
      : { category: "personal" },
  });

  async function handleFormSubmit(values: EventInput) {
    const result = await onSubmit(values);
    if (!result?.error) {
      setOpen(false);
      if (!event) reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "New event"}</DialogTitle>
          <DialogDescription>College events, workshops, hackathons, club activities, or personal reminders.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Robotics club meetup" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={watch("category")} onValueChange={(v) => setValue("category", v as EventInput["category"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="eventDate">Date</Label>
              <Input id="eventDate" type="date" {...register("eventDate")} />
              {errors.eventDate && <p className="text-xs text-destructive">{errors.eventDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Optional" {...register("location")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" type="time" {...register("startTime")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime">End time</Label>
              <Input id="endTime" type="time" {...register("endTime")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Optional"
              {...register("description")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {event ? "Save changes" : "Add event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
