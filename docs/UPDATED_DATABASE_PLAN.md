# CampusTracker — Updated Database Plan & Connector Schema

**Document Version**: `3.0.0`  
**Status**: APPROVED SCHEMA  
**Target Migration**: `supabase/migrations/0014_connector_framework.sql`  

---

## 1. Executive Summary

The database schema is upgraded to provide full persistence for the **Academic Connector Framework**, real-time **Connector Health Monitoring**, **Dynamic Column Mappings**, **Delta Sync Hashes**, and **Retry Queues**.

All multi-tenant data structures support multi-college deployments out of the box.

---

## 2. Detailed DDL Specifications

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- 1. connectors
-- Master Connector Instance Table
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

-- ─────────────────────────────────────────────────────────────────────────
-- 2. connector_configuration
-- Stores Connector Connection Settings & Dynamic Column Mappings
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.connector_configuration (
  id                  uuid primary key default gen_random_uuid(),
  connector_id        uuid not null unique references public.connectors(id) on delete cascade,
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  config              jsonb not null default '{}'::jsonb,        -- URL, Sheet ID, Tab Name, Auth Credentials
  field_mappings      jsonb not null default '[]'::jsonb,       -- Source Column -> Target Field Map
  header_row_index    integer not null default 1,
  data_start_row_index integer not null default 2,
  polling_interval    integer not null default 3600,             -- Polling frequency in seconds
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

-- ─────────────────────────────────────────────────────────────────────────
-- 3. sync_history
-- Stores Row-Level Hashes for Delta Change Detection
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.sync_history (
  id                  uuid primary key default gen_random_uuid(),
  connector_id        uuid not null references public.connectors(id) on delete cascade,
  institution_id      uuid not null references public.institutions(id) on delete cascade,
  entity_key          text not null, -- e.g. 'ROLL-101_SUB-DBMS_2026-08-07'
  record_hash         text not null, -- SHA-256 content hash
  last_seen_at        timestamptz not null default now(),
  unique (connector_id, entity_key)
);

create index if not exists idx_sync_history_connector_key on public.sync_history (connector_id, entity_key);

-- ─────────────────────────────────────────────────────────────────────────
-- 4. retry_queue
-- Exponential Backoff & Retry Queue for Network Errors
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
```
