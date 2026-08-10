import { NextRequest } from 'next/server';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/validate-request';

export const GET = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  const authUser = await requireAuth(supabaseAuth);

  const { searchParams } = new URL(req.url);
  const studentMasterId = searchParams.get('studentMasterId');

  if (!studentMasterId) {
    throw ApiError.validation('Missing studentMasterId query parameter');
  }

  // Server-side Student Data Isolation check
  const { data: profile } = await supabaseAuth
    .from('profiles')
    .select('role')
    .eq('id', authUser.id)
    .single();

  const role = profile?.role || 'student';

  if (role === 'student') {
    const { data: studentMaster } = await supabaseAuth
      .from('student_master')
      .select('id, user_id')
      .eq('id', studentMasterId)
      .single();

    const sm = studentMaster as { id: string; user_id: string } | null;
    if (!sm || sm.user_id !== authUser.id) {
      throw ApiError.forbidden('You are not authorized to view another student\'s academic marks');
    }
  }

  const supabase = createAdminClient();

  // 1. Fetch internal assessment marks
  const { data: internalMarks, error: marksErr } = await supabase
    .from('internal_marks')
    .select('*, subjects(name, code)')
    .eq('student_master_id', studentMasterId)
    .order('created_at', { ascending: false });

  if (marksErr) {
    throw ApiError.internal(`Failed to fetch internal marks: ${marksErr.message}`);
  }

  // 2. Fetch semester results (SGPA & CGPA)
  const { data: semesterResults, error: resultsErr } = await supabase
    .from('semester_results')
    .select('*')
    .eq('student_master_id', studentMasterId)
    .order('semester', { ascending: true });

  if (resultsErr) {
    throw ApiError.internal(`Failed to fetch semester results: ${resultsErr.message}`);
  }

  return createSuccessResponse({
    internalMarks: internalMarks || [],
    semesterResults: semesterResults || [],
  });
});
