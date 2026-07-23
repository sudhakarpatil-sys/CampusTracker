-- CampusTracker — Phase 2 schema
-- Adds the full academic management system on top of 0001_init.sql.
-- Run after 0001_init.sql via the SQL editor, or `supabase db push`.

-- ─────────────────────────────────────────────────────────────────────────
-- subjects
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.subjects (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  name                text not null,
  code                text,
  faculty_name        text,
  classroom           text,
  credits             numeric,
  attendance_target   numeric not null default 75,
  color               text not null default '#5B7FFF',
  is_archived         boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists subjects_user_id_idx on public.subjects (user_id);

alter table public.subjects enable row level security;

create policy "Subjects are manageable by their owner"
  on public.subjects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_subjects_updated_at
  before update on public.subjects
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- timetable_slots
-- day_of_week: 1 = Monday ... 7 = Sunday (ISO-8601), so weekday math never
-- has an off-by-one against `date-fns`'s getISODay().
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.timetable_slots (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  subject_id    uuid not null references public.subjects (id) on delete cascade,
  day_of_week   smallint not null check (day_of_week between 1 and 7),
  start_time    time not null,
  end_time      time not null,
  faculty_name  text,
  classroom     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint timetable_slots_time_order check (end_time > start_time)
);

create index if not exists timetable_slots_user_day_idx on public.timetable_slots (user_id, day_of_week);

alter table public.timetable_slots enable row level security;

create policy "Timetable slots are manageable by their owner"
  on public.timetable_slots for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_timetable_slots_updated_at
  before update on public.timetable_slots
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- attendance_records
-- One row per (timetable_slot, calendar date). Marking attendance is an
-- upsert on (user_id, timetable_slot_id, class_date).
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.attendance_records (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  subject_id         uuid not null references public.subjects (id) on delete cascade,
  timetable_slot_id  uuid references public.timetable_slots (id) on delete set null,
  class_date         date not null,
  status             text not null check (status in ('present', 'absent', 'cancelled')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_id, timetable_slot_id, class_date)
);

create index if not exists attendance_records_user_subject_idx on public.attendance_records (user_id, subject_id);
create index if not exists attendance_records_user_date_idx on public.attendance_records (user_id, class_date);

alter table public.attendance_records enable row level security;

create policy "Attendance records are manageable by their owner"
  on public.attendance_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_attendance_records_updated_at
  before update on public.attendance_records
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- assignments
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.assignments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  subject_id     uuid references public.subjects (id) on delete set null,
  title          text not null,
  description    text,
  due_date       date,
  due_time       time,
  priority       text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status         text not null default 'not_started' check (status in ('not_started', 'in_progress', 'submitted', 'completed')),
  attachments    jsonb not null default '[]'::jsonb,
  notes          text,
  is_archived    boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists assignments_user_status_idx on public.assignments (user_id, status);
create index if not exists assignments_user_due_date_idx on public.assignments (user_id, due_date);

alter table public.assignments enable row level security;

create policy "Assignments are manageable by their owner"
  on public.assignments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_assignments_updated_at
  before update on public.assignments
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- notes
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.notes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  subject_id     uuid references public.subjects (id) on delete set null,
  title          text not null default 'Untitled note',
  content        text not null default '',
  attachments    jsonb not null default '[]'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists notes_user_subject_idx on public.notes (user_id, subject_id);

alter table public.notes enable row level security;

create policy "Notes are manageable by their owner"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_notes_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- tasks
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  due_date      date,
  priority      text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  is_completed  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists tasks_user_completed_idx on public.tasks (user_id, is_completed);

alter table public.tasks enable row level security;

create policy "Tasks are manageable by their owner"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- events
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  title          text not null,
  description    text,
  category       text not null default 'personal' check (category in ('college', 'workshop', 'hackathon', 'club', 'personal')),
  event_date     date not null,
  start_time     time,
  end_time       time,
  location       text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists events_user_date_idx on public.events (user_id, event_date);

alter table public.events enable row level security;

create policy "Events are manageable by their owner"
  on public.events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- exams
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.exams (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users (id) on delete cascade,
  subject_id            uuid references public.subjects (id) on delete set null,
  exam_date             date not null,
  exam_time             time,
  venue                 text,
  syllabus              text,
  preparation_status    text not null default 'not_started' check (preparation_status in ('not_started', 'in_progress', 'ready')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists exams_user_date_idx on public.exams (user_id, exam_date);

alter table public.exams enable row level security;

create policy "Exams are manageable by their owner"
  on public.exams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_exams_updated_at
  before update on public.exams
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- user_preferences: timetable display settings (weekends toggle)
-- ─────────────────────────────────────────────────────────────────────────
alter table public.user_preferences
  add column if not exists timetable_settings jsonb not null default '{"showWeekends": false}'::jsonb;

-- ─────────────────────────────────────────────────────────────────────────
-- Realtime: broadcast row changes so the dashboard/pages update live
-- without a manual refresh. Safe to re-run — Postgres ignores duplicates.
-- ─────────────────────────────────────────────────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array['subjects','timetable_slots','attendance_records','assignments','notes','tasks','events','exams']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- Storage: attachments bucket (assignment/note attachments)
-- ─────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

create policy "Attachments are publicly readable"
  on storage.objects for select
  using (bucket_id = 'attachments');

create policy "Users can upload their own attachments"
  on storage.objects for insert
  with check (bucket_id = 'attachments' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own attachments"
  on storage.objects for update
  using (bucket_id = 'attachments' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own attachments"
  on storage.objects for delete
  using (bucket_id = 'attachments' and auth.uid()::text = (storage.foldername(name))[1]);
