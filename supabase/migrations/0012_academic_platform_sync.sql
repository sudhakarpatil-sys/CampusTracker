-- CampusTracker — Phase 4B-1 Migration
-- Multi-Tenant Institutions, Student Master Registry, Academic Data Sync Engine, Internal Marks & Semester Results

-- ─────────────────────────────────────────────────────────────────────────
-- 1. institutions
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.institutions (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  code                text not null unique,
  domain              text,
  logo_url            text,
  primary_color       text default '#5B7FFF',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.institutions is 'Multi-tenant educational institutions table.';

alter table public.institutions enable row level security;

create policy "Institutions are viewable by authenticated users"
  on public.institutions for select
  using (auth.role() = 'authenticated');

create trigger set_institutions_updated_at
  before update on public.institutions
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. departments
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.departments (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  name                text not null,
  code                text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (institution_id, code)
);

alter table public.departments enable row level security;

create policy "Departments are viewable by authenticated users"
  on public.departments for select
  using (auth.role() = 'authenticated');

create trigger set_departments_updated_at
  before update on public.departments
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. classes
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.classes (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  department_id       uuid not null references public.departments(id) on delete cascade,
  name                text not null,
  semester            smallint not null,
  academic_year       text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.classes enable row level security;

create policy "Classes are viewable by authenticated users"
  on public.classes for select
  using (auth.role() = 'authenticated');

create trigger set_classes_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 4. student_master
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.student_master (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  department_id       uuid references public.departments(id) on delete set null,
  class_id            uuid references public.classes(id) on delete set null,
  student_id          text not null,
  roll_number         text not null,
  full_name           text not null,
  official_email      text,
  personal_email      text,
  phone_number        text,
  user_id             uuid references auth.users(id) on delete set null,
  is_activated        boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (institution_id, student_id)
);

create index if not exists idx_student_master_inst_roll on public.student_master (institution_id, roll_number);
create index if not exists idx_student_master_user on public.student_master (user_id);

alter table public.student_master enable row level security;

create policy "Student master viewable by account owner or admin"
  on public.student_master for select
  using (
    auth.uid() = user_id 
    or 
    (auth.jwt() ->> 'role' = 'admin' and (auth.jwt() ->> 'institution_id')::uuid = institution_id)
  );

create trigger set_student_master_updated_at
  before update on public.student_master
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 5. sync_connectors
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.sync_connectors (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  name                text not null,
  connector_type      text not null check (connector_type in ('google_sheets', 'excel', 'csv', 'erp_api')),
  config              jsonb not null default '{}'::jsonb,
  field_mappings      jsonb not null default '{}'::jsonb,
  sync_frequency      text not null default 'daily' check (sync_frequency in ('manual', 'hourly', 'daily', 'weekly')),
  is_active           boolean not null default true,
  last_synced_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.sync_connectors enable row level security;

create policy "Sync connectors manageable by admin"
  on public.sync_connectors for all
  using (
    auth.jwt() ->> 'role' = 'admin' 
    and 
    (auth.jwt() ->> 'institution_id')::uuid = institution_id
  );

create trigger set_sync_connectors_updated_at
  before update on public.sync_connectors
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 6. sync_jobs
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.sync_jobs (
  id                  uuid primary key default gen_random_uuid(),
  connector_id        uuid not null references public.sync_connectors(id) on delete cascade,
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  status              text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'partial_warning')),
  triggered_by        text not null default 'scheduled_cron',
  processed_rows      integer default 0,
  inserted_rows       integer default 0,
  updated_rows        integer default 0,
  quarantined_rows    integer default 0,
  error_log           text,
  execution_time_ms   integer,
  started_at          timestamptz not null default now(),
  completed_at        timestamptz
);

alter table public.sync_jobs enable row level security;

create policy "Sync jobs viewable by admin"
  on public.sync_jobs for select
  using (
    auth.jwt() ->> 'role' = 'admin' 
    and 
    (auth.jwt() ->> 'institution_id')::uuid = institution_id
  );

-- ─────────────────────────────────────────────────────────────────────────
-- 7. sync_quarantine_rows
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.sync_quarantine_rows (
  id                  uuid primary key default gen_random_uuid(),
  sync_job_id         uuid not null references public.sync_jobs(id) on delete cascade,
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  raw_data            jsonb not null,
  failure_reason      text not null,
  is_resolved         boolean not null default false,
  resolved_at         timestamptz,
  created_at          timestamptz not null default now()
);

alter table public.sync_quarantine_rows enable row level security;

create policy "Quarantine rows manageable by admin"
  on public.sync_quarantine_rows for all
  using (
    auth.jwt() ->> 'role' = 'admin' 
    and 
    (auth.jwt() ->> 'institution_id')::uuid = institution_id
  );

-- ─────────────────────────────────────────────────────────────────────────
-- 8. internal_marks
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.internal_marks (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  student_master_id   uuid not null references public.student_master(id) on delete cascade,
  subject_id          uuid references public.subjects(id) on delete cascade,
  test_name           text not null,
  max_marks           numeric not null,
  marks_obtained      numeric not null,
  weightage_percent   numeric,
  sync_job_id         uuid references public.sync_jobs(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_internal_marks_student on public.internal_marks (student_master_id);

alter table public.internal_marks enable row level security;

create policy "Internal marks viewable by student owner"
  on public.internal_marks for select
  using (
    student_master_id in (
      select id from public.student_master where user_id = auth.uid()
    )
  );

create trigger set_internal_marks_updated_at
  before update on public.internal_marks
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 9. semester_results
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.semester_results (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  student_master_id   uuid not null references public.student_master(id) on delete cascade,
  semester            smallint not null,
  sgpa                numeric(4,2) not null,
  cgpa                numeric(4,2) not null,
  total_credits       numeric,
  earned_credits      numeric,
  backlog_count       integer not null default 0,
  result_status       text default 'PASS' check (result_status in ('PASS', 'FAIL', 'ATKT', 'WITHHELD')),
  sync_job_id         uuid references public.sync_jobs(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (student_master_id, semester)
);

create index if not exists idx_semester_results_student on public.semester_results (student_master_id);

alter table public.semester_results enable row level security;

create policy "Semester results viewable by student owner"
  on public.semester_results for select
  using (
    student_master_id in (
      select id from public.student_master where user_id = auth.uid()
    )
  );

create trigger set_semester_results_updated_at
  before update on public.semester_results
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 10. academic_calendar
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.academic_calendar (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  title               text not null,
  description         text,
  event_type          text not null default 'general' check (event_type in ('exam', 'holiday', 'sports', 'cultural', 'academic', 'general')),
  start_date          date not null,
  end_date            date,
  is_holiday          boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.academic_calendar enable row level security;

create policy "Academic calendar viewable by authenticated users"
  on public.academic_calendar for select
  using (auth.role() = 'authenticated');

create trigger set_academic_calendar_updated_at
  before update on public.academic_calendar
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- Realtime publication updates for new academic tables
-- ─────────────────────────────────────────────────────────────────────────
do $$
declare
  t text;
begin
  foreach t in array array['student_master','internal_marks','semester_results','academic_calendar']
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
-- Storage: official-imports bucket
-- ─────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('official-imports', 'official-imports', false)
on conflict (id) do nothing;

create policy "Official imports accessible by institution admin"
  on storage.objects for all
  using (
    bucket_id = 'official-imports'
    and
    auth.jwt() ->> 'role' = 'admin'
  );
