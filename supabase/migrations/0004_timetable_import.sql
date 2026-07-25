-- CampusTracker — Phase 3A, Milestone 1: AI Smart Timetable Import
-- Additive only. No existing table's behavior changes.

alter table public.subjects
  add column if not exists created_via text not null default 'manual'
    check (created_via in ('manual', 'ai_import'));

create table if not exists public.timetable_imports (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references auth.users (id) on delete cascade,

  file_path                 text not null,
  original_filename         text not null,
  mime_type                 text not null,
  file_size                 integer not null,
  checksum                  text not null,

  status                    text not null default 'processing'
    check (status in ('processing', 'needs_review', 'imported', 'failed', 'cancelled')),
  failure_reason            text,

  detected_branch           text,
  detected_semester         text,
  detected_academic_year    text,
  detected_division         text,
  detection_confidence      jsonb not null default '{}'::jsonb,

  extracted_payload         jsonb,

  version_number            integer not null default 1,
  replaces_import_id        uuid references public.timetable_imports (id) on delete set null,
  superseded_by             uuid references public.timetable_imports (id) on delete set null,

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists timetable_imports_user_id_idx on public.timetable_imports (user_id);
create index if not exists timetable_imports_user_status_idx on public.timetable_imports (user_id, status);
create index if not exists timetable_imports_checksum_idx on public.timetable_imports (user_id, checksum);

alter table public.timetable_imports enable row level security;

create policy "Timetable imports are manageable by their owner"
  on public.timetable_imports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_timetable_imports_updated_at
  before update on public.timetable_imports
  for each row execute function public.set_updated_at();

create table if not exists public.timetable_import_items (
  id                  uuid primary key default gen_random_uuid(),
  import_id           uuid not null references public.timetable_imports (id) on delete cascade,
  user_id             uuid not null references auth.users (id) on delete cascade,

  subject_name_raw    text not null,
  matched_subject_id  uuid references public.subjects (id) on delete set null,

  day_of_week         smallint check (day_of_week between 1 and 7),
  start_time          time,
  end_time            time,
  faculty_name        text,
  classroom           text,

  confidence          text not null default 'medium' check (confidence in ('high', 'medium', 'low')),
  is_included         boolean not null default true,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists timetable_import_items_import_id_idx on public.timetable_import_items (import_id);
create index if not exists timetable_import_items_user_id_idx on public.timetable_import_items (user_id);

alter table public.timetable_import_items enable row level security;

create policy "Timetable import items are manageable by their owner"
  on public.timetable_import_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger set_timetable_import_items_updated_at
  before update on public.timetable_import_items
  for each row execute function public.set_updated_at();

do $$
declare
  t text;
begin
  foreach t in array array['timetable_imports','timetable_import_items']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- Storage: no new bucket. The existing `attachments` bucket from
-- 0002_academic_system.sql already RLS-scopes uploads/reads/updates/deletes
-- per-user-folder, covering any file type at any path prefix. Note it is
-- PUBLIC-READ (see 0002) — timetable source files stored there are only as
-- private as their folder path being unguessable, same tradeoff that
-- already exists for assignment/note attachments.
