import { NextRequest } from 'next/server';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/validate-request';
import { predictAttendance, computeAttendanceStats } from '@/lib/academic';

export const GET = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const targetPercent = Number(searchParams.get('targetPercent') || '75');

  if (!userId) {
    throw ApiError.validation('Missing userId query parameter');
  }

  const supabase = createAdminClient();

  // 1. Fetch attendance records
  const { data: records, error: recordsErr } = await supabase
    .from('attendance_records')
    .select('*, subjects(id, name, code, color)')
    .eq('user_id', userId)
    .order('class_date', { ascending: false });

  if (recordsErr) {
    throw ApiError.internal(`Failed to fetch attendance records: ${recordsErr.message}`);
  }

  const attendanceRecords = records || [];
  const overallStats = computeAttendanceStats(attendanceRecords);
  const overallPrediction = predictAttendance(overallStats, targetPercent);

  // 2. Group statistics per subject
  const subjectMap = new Map<string, { subject: any; records: any[] }>();

  attendanceRecords.forEach((rec) => {
    const subId = rec.subject_id;
    if (!subjectMap.has(subId)) {
      subjectMap.set(subId, { subject: rec.subjects, records: [] });
    }
    subjectMap.get(subId)!.records.push(rec);
  });

  const subjectBreakdown = Array.from(subjectMap.values()).map(({ subject, records: subRecords }) => {
    const subStats = computeAttendanceStats(subRecords);
    const subPrediction = predictAttendance(subStats, targetPercent);
    return {
      subject,
      stats: subStats,
      prediction: subPrediction,
    };
  });

  return createSuccessResponse({
    overall: {
      stats: overallStats,
      prediction: overallPrediction,
    },
    subjectBreakdown,
    records: attendanceRecords,
  });
});
