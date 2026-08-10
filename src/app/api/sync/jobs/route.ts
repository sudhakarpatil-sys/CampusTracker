import { NextRequest } from 'next/server';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/validate-request';

export const GET = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const { searchParams } = new URL(req.url);
  const institutionId = searchParams.get('institutionId');
  const connectorId = searchParams.get('connectorId');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const supabase = createAdminClient();
  let query = supabase
    .from('sync_jobs')
    .select('*, sync_connectors(name, connector_type)')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (institutionId) {
    query = query.eq('institution_id', institutionId);
  }

  if (connectorId) {
    query = query.eq('connector_id', connectorId);
  }

  const { data, error } = await query;

  if (error) {
    throw ApiError.internal(`Failed to fetch sync jobs: ${error.message}`);
  }

  return createSuccessResponse(data || []);
});
