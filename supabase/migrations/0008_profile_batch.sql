-- CampusTracker — Phase 3A follow-up: student batch for lab disambiguation

alter table public.profiles
  add column if not exists batch text;

comment on column public.profiles.batch is
  'Optional lab/practical sub-batch within the student''s division, e.g. "A1" for Division A, Batch 1, or "B2" for Division B, Batch 2. Lets the AI timetable import pick the correct parallel session when a division''s timetable shows two batches running different labs at the same time.';
