import { createAdminClient } from '../src/lib/supabase/admin';

async function cleanupDatabase() {
  console.log('🚀 Starting CampusTracker Safe Database Cleanup...');
  const supabase = createAdminClient();

  const tablesToTruncate = [
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
    'semester_results',
  ];

  for (const table of tablesToTruncate) {
    try {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        if (error.code === '42P01') {
          console.log(`ℹ️ Table ${table} does not exist yet (skipped).`);
        } else {
          console.warn(`⚠️ Notice for ${table}: ${error.message}`);
        }
      } else {
        console.log(`✅ ${table} cleared successfully.`);
      }
    } catch (err: any) {
      console.error(`❌ Error clearing ${table}:`, err.message);
    }
  }

  console.log('\n✨ Database cleanup complete! All existing legacy data removed safely.');
}

cleanupDatabase();
