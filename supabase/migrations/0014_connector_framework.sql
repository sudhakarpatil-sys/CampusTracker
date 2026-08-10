-- CampusTracker — Phase 4B Connector Framework Migration
-- Adds multi-tenant connectors, connector_configuration, sync_history, and retry_queue tables.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. connectors
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.connectors (
  id                  uuid primary key default gen_random_uuid(),
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  name                text not null,
  connector_type      text not null check (connector_type in ('google_sheets', 'excel_gdrive', 'excel_onedrive', 'sharepoint', 'csv', 'erp_api', 'sql_db', 'custom_sdk')),
  is_active           boolean not null default true,
  health_status       text not null default 'DISCONNECTED' check (health_status in ('CONNECTED', 'DISCONNECTED', 'AUTH_FAILED', 'SHEET_NOT_FOUND', 'PERMISSION_DENIED', 'RATE_LIMITED', 'NETWORK_ERROR', 'RETRYING')),
  last_health_check   timestamptz,
  last_successful_sync timestamptz,
  last_failed_sync    timestamptz,
  last_error_message  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.connectors enable row level security;

create policy "Connectors manageable by institution admin"
  on public.connectors for all
  using (
    auth.jwt() ->> 'role' = 'admin' 
    and 
    (auth.jwt() ->> 'institution_id')::uuid = institution_id
  );

create trigger set_connectors_updated_at
  before update on public.connectors
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. connector_configuration
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.connector_configuration (
  id                  uuid primary key default gen_random_uuid(),
  connector_id        uuid not null unique references public.connectors(id) on delete cascade,
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  config              jsonb not null default '{}'::jsonb,
  field_mappings      jsonb not null default '[]'::jsonb,
  header_row_index    integer not null default 1,
  data_start_row_index integer not null default 2,
  polling_interval    integer not null default 3600,
  conflict_policy     text not null default 'source_wins',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.connector_configuration enable row level security;

create policy "Config manageable by institution admin"
  on public.connector_configuration for all
  using (
    auth.jwt() ->> 'role' = 'admin' 
    and 
    (auth.jwt() ->> 'institution_id')::uuid = institution_id
  );

create trigger set_connector_configuration_updated_at
  before update on public.connector_configuration
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- 3. sync_history
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.sync_history (
  id                  uuid primary key default gen_random_uuid(),
  connector_id        uuid not null references public.connectors(id) on delete cascade,
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  entity_key          text not null,
  record_hash         text not null,
  last_seen_at        timestamptz not null default now(),
  unique (connector_id, entity_key)
);

create index if not exists idx_sync_history_connector_key on public.sync_history (connector_id, entity_key);

alter table public.sync_history enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- 4. retry_queue
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.retry_queue (
  id                  uuid primary key default gen_random_uuid(),
  connector_id        uuid not null references public.connectors(id) on delete cascade,
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  attempt_count       integer not null default 0,
  next_retry_at       timestamptz not null,
  error_reason        text,
  status              text not null default 'pending' check (status in ('pending', 'processing', 'resolved', 'abandoned')),
  created_at          timestamptz not null default now()
);

alter table public.retry_queue enable row level security;
