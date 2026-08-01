-- CampusTracker — Phase 3C: Audit Logging
-- Append-only table for tracking user actions.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.audit_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  action       text not null,
  entity_type  text not null,
  entity_id    text,
  metadata     jsonb not null default '{}'::jsonb,
  ip_address   text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

comment on table public.audit_logs is 'Immutable audit trail for user actions. No update/delete policies — logs are append-only.';

create index if not exists audit_logs_user_created_idx
  on public.audit_logs (user_id, created_at desc);

create index if not exists audit_logs_action_idx
  on public.audit_logs (action);

alter table public.audit_logs enable row level security;

-- Users can read their own audit logs (for future "activity history" UI).
create policy "Users can view their own audit logs"
  on public.audit_logs for select
  using (auth.uid() = user_id);

-- Users can insert their own audit logs.
create policy "Users can create their own audit logs"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

-- No update or delete policies — audit logs are immutable.

-- Add to realtime publication for live activity feeds (future).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'audit_logs'
  ) then
    execute 'alter publication supabase_realtime add table public.audit_logs';
  end if;
end $$;
