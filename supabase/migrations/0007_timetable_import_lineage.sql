-- CampusTracker — Phase 3A, Milestones 8 & 9: Duplicate Detection & Version History

alter table public.timetable_slots
  add column if not exists source_import_id uuid references public.timetable_imports (id) on delete set null;

alter table public.subjects
  add column if not exists source_import_id uuid references public.timetable_imports (id) on delete set null;

create index if not exists timetable_slots_source_import_idx on public.timetable_slots (source_import_id);
create index if not exists subjects_source_import_idx on public.subjects (source_import_id);

alter table public.timetable_imports drop constraint if exists timetable_imports_status_check;
alter table public.timetable_imports
  add constraint timetable_imports_status_check
  check (status in ('processing', 'needs_review', 'imported', 'failed', 'cancelled', 'superseded'));

alter table public.timetable_imports
  add column if not exists duplicate_resolution text
    check (duplicate_resolution in ('replace', 'merge', 'new', 'pending') or duplicate_resolution is null);
