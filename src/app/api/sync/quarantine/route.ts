import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/validate-request';

const ResolveQuarantineSchema = z.object({
  quarantineId: z.string().uuid(),
  isResolved: z.boolean().default(true),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const { searchParams } = new URL(req.url);
  const syncJobId = searchParams.get('syncJobId');
  const institutionId = searchParams.get('institutionId');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const supabase = createAdminClient();
  let query = supabase
    .from('sync_quarantine_rows')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (syncJobId) {
    query = query.eq('sync_job_id', syncJobId);
  }

  if (institutionId) {
    query = query.eq('institution_id', institutionId);
  }

  const { data, error } = await query;

  if (error) {
    throw ApiError.internal(`Failed to fetch quarantine rows: ${error.message}`);
  }

  return createSuccessResponse(data || []);
});

export const PATCH = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const body = await req.json();
  const parsed = ResolveQuarantineSchema.parse(body);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sync_quarantine_rows')
    .update({
      is_resolved: parsed.isResolved,
      resolved_at: parsed.isResolved ? new Date().toISOString() : null,
    })
    .eq('id', parsed.quarantineId)
    .select('*')
    .single();

  if (error) {
    throw ApiError.internal(`Failed to update quarantine row: ${error.message}`);
  }

  return createSuccessResponse(data);
});
