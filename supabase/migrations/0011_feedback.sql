-- CampusTracker — Phase 3C: User Feedback System
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.feedback (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  category        text not null check (category in ('bug', 'feature', 'ui_ux', 'performance', 'general')),
  description     text not null,
  screenshot_url  text,
  page_url        text,
  browser_info    jsonb not null default '{}'::jsonb,
  device_info     jsonb not null default '{}'::jsonb,
  status          text not null default 'new' check (status in ('new', 'reviewed', 'resolved', 'dismissed')),
  admin_notes     text,
  created_at      timestamptz not null default now()
);

comment on table public.feedback is 'User-submitted bug reports, feature requests, and feedback. Prepares for future Admin Portal.';

create index if not exists feedback_user_created_idx
  on public.feedback (user_id, created_at desc);

create index if not exists feedback_status_idx
  on public.feedback (status);

alter table public.feedback enable row level security;

-- Users can read their own feedback submissions.
create policy "Users can view their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

-- Users can submit feedback.
create policy "Users can create feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

-- No user update/delete — only future admin role can manage feedback status.

-- Storage bucket for feedback screenshots (private).
insert into storage.buckets (id, name, public)
values ('feedback', 'feedback', false)
on conflict (id) do nothing;

-- Users can upload their own screenshots.
create policy "Users can upload feedback screenshots"
  on storage.objects for insert
  with check (bucket_id = 'feedback' and auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own screenshots.
create policy "Users can view their own feedback screenshots"
  on storage.objects for select
  using (bucket_id = 'feedback' and auth.uid()::text = (storage.foldername(name))[1]);
