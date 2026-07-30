-- CampusTracker — Phase 3A follow-up: archive instead of delete on Replace
--
-- Previously, re-importing a changed timetable with "Replace" hard-deleted
-- old timetable_slots rows. attendance_records.timetable_slot_id already
-- uses ON DELETE SET NULL (not cascade), so attendance rows themselves
-- were never destroyed — but deleting the slot severed which specific
-- lecture (day/time/faculty/room) that attendance was for, and duplicate
-- detection could still miss real duplicates since it matched on fuzzy
-- AI-detected branch/semester text rather than a hard fact.
--
-- This migration adds an is_archived flag (same pattern subjects already
-- uses) so old slots — and every attendance record still pointing at
-- them — stay fully intact and queryable forever. Only the *active*
-- timetable view is ever filtered to is_archived = false.

alter table public.timetable_slots
  add column if not exists is_archived boolean not null default false;

create index if not exists timetable_slots_user_active_idx
  on public.timetable_slots (user_id, is_archived);

comment on column public.timetable_slots.is_archived is
  'True once a slot has been superseded by a "Replace" re-import. Never deleted — attendance_records may still reference it via timetable_slot_id, and historical attendance stays fully queryable against its original day/time/faculty/room.';
