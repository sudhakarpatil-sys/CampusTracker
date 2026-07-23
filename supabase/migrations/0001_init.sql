-- CampusTracker — Phase 1 schema
-- Run via `supabase db push`, the SQL editor in the Supabase dashboard, or
-- `supabase migration up` once this file lives in supabase/migrations.

-- ─────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- profiles
-- One row per auth user, created automatically on sign-up (see trigger
-- below). Holds onboarding + academic info.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                     uuid primary key references auth.users (id) on delete cascade,
  full_name              text,
  avatar_url             text,
  college_name           text,
  university             text,
  department             text,
  branch                 text,
  semester               text,
  academic_year          text,
  roll_number            text,
  onboarding_completed   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.profiles is 'One row per user; extends auth.users with academic + onboarding info.';

alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by their owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No delete policy: profile rows are removed automatically via the
-- `on delete cascade` from auth.users, never directly by clients.

-- ─────────────────────────────────────────────────────────────────────────
-- user_preferences
-- One row per user. Theme, dashboard widget layout, notification toggles.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.user_preferences (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references auth.users (id) on delete cascade,
  theme                 text not null default 'dark' check (theme in ('light', 'dark', 'system')),
  dashboard_layout      jsonb not null default '{}'::jsonb,
  notification_prefs    jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.user_preferences is 'Per-user app preferences: theme, dashboard layout, notification toggles.';

alter table public.user_preferences enable row level security;

create policy "Preferences are viewable by their owner"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Preferences are insertable by their owner"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Preferences are updatable by their owner"
  on public.user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Preferences are deletable by their owner"
  on public.user_preferences for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- notifications
-- One row per notification. Phase 1 ships the UI only; future phases will
-- insert real rows from attendance/assignment/exam logic and, eventually,
-- database webhooks or scheduled functions.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  message       text not null,
  type          text not null default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);

comment on table public.notifications is 'Per-user notifications, RLS-scoped. Populated by future feature phases.';

create index if not exists notifications_user_id_created_at_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Notifications are viewable by their owner"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Notifications are insertable by their owner"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "Notifications are updatable by their owner"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Notifications are deletable by their owner"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────
-- updated_at trigger
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- New-user bootstrap
-- Creates a blank profiles + user_preferences row the moment someone signs
-- up, so the app never has to special-case "no profile yet".
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- Storage: avatars bucket
-- ─────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
