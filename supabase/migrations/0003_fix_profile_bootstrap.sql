-- CampusTracker — Phase 2.1: profile bootstrap repair
--
-- Root cause of the "redirected back to onboarding forever" bug:
--   1. The on_auth_user_created trigger (from 0001_init.sql) either never
--      ran for some users — most commonly because they were created
--      before the trigger existed, but a failed/partial migration apply
--      or a permissions issue on `auth.users` can cause the same symptom
--      — so `public.profiles` never got a row for them.
--   2. The onboarding flow used `.update()` instead of `.upsert()`, so
--      saving onboarding data against a *missing* profile row silently
--      succeeded (0 rows affected, no error returned by PostgREST) —
--      the app then redirected to /dashboard believing it had worked.
--   3. Middleware re-checks `profiles.onboarding_completed` on every
--      request; since no row ever existed, it kept evaluating to
--      "incomplete" and bounced the user back to /onboarding forever.
--
-- The application-level fix (onboarding now uses upsert) is enough to
-- stop *new* users from ever hitting this. This migration additionally
-- repairs the two things that can go wrong at the database layer:
--   (a) makes the bootstrap trigger idempotent and defensive so it can
--       never block a signup or silently no-op again, and
--   (b) backfills profiles/user_preferences for any already-existing
--       auth.users rows that are missing them, unsticking anyone
--       currently caught in the redirect loop without needing to
--       delete and recreate their account.

-- ─────────────────────────────────────────────────────────────────────────
-- (a) Harden the bootstrap trigger
--   - ON CONFLICT DO NOTHING makes it safe to run twice for the same user
--     (e.g. if a future retry or manual backfill overlaps with the
--     trigger firing).
--   - Wrapping in EXCEPTION means a bad/unexpected value in
--     raw_user_meta_data can never take down the auth.users insert and
--     block signup entirely.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
exception
  when others then
    -- Never let a bootstrap failure block account creation. Surfacing a
    -- warning is enough; the backfill below (and the app's own upsert-on-
    -- onboarding) are there to self-heal if this branch is ever hit.
    raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- (b) Backfill any existing auth.users missing a profiles/user_preferences
--     row — this is what actually unsticks users stuck in the onboarding
--     redirect loop today.
-- ─────────────────────────────────────────────────────────────────────────
insert into public.profiles (id, full_name)
select u.id, u.raw_user_meta_data ->> 'full_name'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

insert into public.user_preferences (user_id)
select u.id
from auth.users u
left join public.user_preferences up on up.user_id = u.id
where up.user_id is null
on conflict (user_id) do nothing;
