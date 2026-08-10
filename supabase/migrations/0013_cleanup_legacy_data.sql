-- CampusTracker — Safe Database Cleanup Migration
-- Safely truncates existing data tables while ignoring tables that do not exist yet.

do $$
declare
  t text;
  cleaned_count integer := 0;
begin
  foreach t in array array[
    'attendance_records',
    'notifications',
    'audit_logs',
    'feedback',
    'timetable_import_lineage',
    'timetable_import_conflicts',
    'timetable_import_extractions',
    'timetable_imports',
    'sync_quarantine_rows',
    'sync_jobs',
    'internal_marks',
    'semester_results'
  ]
  loop
    if to_regclass('public.' || quote_ident(t)) is not null then
      execute format('truncate table public.%I cascade', t);
      cleaned_count := cleaned_count + 1;
    end if;
  end loop;

  raise notice 'CampusTracker database cleanup finished successfully! Cleansed % tables.', cleaned_count;
end $$;
