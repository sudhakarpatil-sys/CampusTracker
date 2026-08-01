# CampusTracker — Database Impact & Mobile Schema Delta

**Document Identifier**: `DOC-MOB-008`  
**Phase**: 4B — Architectural Blueprint  
**Status**: APPROVED  
**Author**: Senior Backend Architect & Database Administrator  

---

## 1. Existing Database Overview

The CampusTracker database is powered by Supabase (PostgreSQL 15+). The existing migrations (`0001_init.sql` through `0011_feedback.sql`) handle user profiles, preferences, subjects, timetable slots, attendance records, assignments, notes, tasks, events, exams, AI timetable imports, audit logs, and feedback.

The web application schema remains 100% backward-compatible. Mobile requirements introduce **Migration 0012** (`0012_mobile_qr_attendance.sql`) to support mobile security, dynamic QR sessions, push notifications, and geofencing.

---

## 2. Migration `0012_mobile_qr_attendance.sql` Specification

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- CampusTracker — Migration 0012: Mobile & QR Attendance System Schema
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Student Device Registrations (Hardware Fingerprinting)
create table if not exists public.student_device_registrations (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  device_hardware_id  text not null,
  platform            text not null check (platform in ('ios', 'android')),
  device_model        text,
  os_version          text,
  app_version         text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, device_hardware_id)
);

create index if not exists idx_device_reg_user on public.student_device_registrations (user_id);
create index if not exists idx_device_reg_hardware on public.student_device_registrations (device_hardware_id);

alter table public.student_device_registrations enable row level security;

create policy "Users can manage their own registered devices"
  on public.student_device_registrations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Campus Geofences (GPS Locations)
create table if not exists public.campus_geofences (
  id                  uuid primary key default gen_random_uuid(),
  college_name        text not null,
  building_name       text not null,
  classroom_name      text,
  latitude            numeric(10, 8) not null,
  longitude           numeric(11, 8) not null,
  radius_meters       numeric not null default 30,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.campus_geofences enable row level security;

create policy "Geofences are readable by authenticated users"
  on public.campus_geofences for select
  using (auth.role() = 'authenticated');

-- 3. QR Attendance Sessions (Faculty Session Management)
create table if not exists public.qr_attendance_sessions (
  id                  uuid primary key default gen_random_uuid(),
  faculty_id          uuid not null references auth.users (id) on delete cascade,
  timetable_slot_id  uuid not null references public.timetable_slots (id) on delete cascade,
  subject_id          uuid not null references public.subjects (id) on delete cascade,
  geofence_id         uuid references public.campus_geofences (id) on delete set null,
  totp_secret         text not null,
  session_status      text not null default 'active' check (session_status in ('active', 'completed', 'cancelled')),
  expires_at          timestamptz not null,
  created_at          timestamptz not null default now()
);

create index if not exists idx_qr_session_faculty on public.qr_attendance_sessions (faculty_id, session_status);

alter table public.qr_attendance_sessions enable row level security;

create policy "Faculty can manage their QR sessions"
  on public.qr_attendance_sessions for all
  using (auth.uid() = faculty_id)
  with check (auth.uid() = faculty_id);

create policy "Students can view active QR sessions"
  on public.qr_attendance_sessions for select
  using (auth.role() = 'authenticated');

-- 4. QR Attendance Audit Logs (Scan Verification Attempts)
create table if not exists public.qr_attendance_logs (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references public.qr_attendance_sessions (id) on delete cascade,
  student_id          uuid not null references auth.users (id) on delete cascade,
  device_hardware_id  text not null,
  scanned_latitude    numeric(10, 8),
  scanned_longitude   numeric(11, 8),
  calculated_distance numeric,
  is_mock_location    boolean not null default false,
  confidence_score    text not null check (confidence_score in ('high', 'medium', 'low', 'rejected')),
  status_reason       text,
  created_at          timestamptz not null default now()
);

create index if not exists idx_qr_log_session on public.qr_attendance_logs (session_id);
create index if not exists idx_qr_log_student on public.qr_attendance_logs (student_id);

alter table public.qr_attendance_logs enable row level security;

create policy "Students can view their own QR scan logs"
  on public.qr_attendance_logs for select
  using (auth.uid() = student_id);

create policy "Faculty can view QR logs for their sessions"
  on public.qr_attendance_logs for select
  using (exists (
    select 1 from public.qr_attendance_sessions s
    where s.id = qr_attendance_logs.session_id and s.faculty_id = auth.uid()
  ));

-- 5. Push Notification Subscriptions (Mobile APNs / FCM Tokens)
create table if not exists public.push_subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  push_token          text not null unique,
  platform            text not null check (platform in ('ios', 'android')),
  is_active           boolean not null default true,
  last_used_at        timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists idx_push_user on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

create policy "Users can manage their own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## 3. Realtime & Supabase Impact

To support instantaneous live updates on mobile apps:

```sql
-- Add new mobile tables to Supabase Realtime publication
alter publication supabase_realtime add table public.qr_attendance_sessions;
alter publication supabase_realtime add table public.qr_attendance_logs;
```

- **Faculty Dashboard Realtime**: Subscribes to changes on `qr_attendance_logs` filtered by `session_id` to increment the attendance scan count instantly as students scan.
- **Student Dashboard Realtime**: Subscribes to `attendance_records` to immediately reflect "Present" status on the Smart Stack widget upon successful scan.

---

## 4. SaaS & Multi-Tenant Scalability Strategy

To prepare CampusTracker for Phase 6 (Multi-College SaaS):
1. **Tenant Identifier**: Future migration will introduce `institution_id uuid references public.institutions(id)` to `profiles`, `subjects`, `campus_geofences`, and `qr_attendance_sessions`.
2. **RLS Multi-Tenancy**: All RLS policies will enforce `institution_id = (select institution_id from public.profiles where id = auth.uid())`.
3. **Partitioning**: When tables exceed 10 million rows, `attendance_records` and `qr_attendance_logs` will be range-partitioned by academic year (`academic_year_2026`, `academic_year_2027`).
