-- CampusTracker — Phase 3A, Milestone 5: Timetable Generation

alter table public.timetable_import_items
  add column if not exists conflict_reason text;

comment on column public.timetable_import_items.conflict_reason is
  'Set when validation fails (bad day/time) or this item overlaps another detected lecture on the same day. Null means clean.';
