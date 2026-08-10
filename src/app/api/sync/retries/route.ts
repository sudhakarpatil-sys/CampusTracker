import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { SyncOrchestrator } from '@/lib/sync-engine/sync-orchestrator';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, requireRole } from '@/lib/validate-request';

const TriggerRetrySchema = z.object({
  retryId: z.string().uuid(),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireRole(supabaseAuth, ['admin']);

  const { searchParams } = new URL(req.url);
  const institutionId = searchParams.get('institutionId');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const supabase = createAdminClient();
  let query = supabase
    .from('retry_queue')
    .select('*, sync_connectors(name, connector_type)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (institutionId) {
    query = query.eq('institution_id', institutionId);
  }

  const { data, error } = await query;

  if (error) {
    throw ApiError.internal(`Failed to fetch retry queue: ${error.message}`);
  }

  return createSuccessResponse(data || []);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireRole(supabaseAuth, ['admin']);

  const body = await req.json();
  const parsed = TriggerRetrySchema.parse(body);

  const supabase = createAdminClient();
  const { data: retryItem, error: fetchErr } = await supabase
    .from('retry_queue')
    .select('*')
    .eq('id', parsed.retryId)
    .single();

  if (fetchErr || !retryItem) {
    throw ApiError.notFound('Retry item');
  }

  // Update status to processing
  await supabase
    .from('retry_queue')
    .update({ status: 'processing', attempt_count: retryItem.attempt_count + 1 })
    .eq('id', parsed.retryId);

  // Trigger sync job via orchestrator
  const orchestrator = new SyncOrchestrator();
  const job = await orchestrator.executeSyncJob({
    connectorId: retryItem.connector_id,
    institutionId: retryItem.institution_id,
    triggeredBy: 'admin_retry_queue',
  });

  // Resolve retry item if job succeeded
  if (job.status === 'completed' || job.status === 'partial_warning') {
    await supabase
      .from('retry_queue')
      .update({ status: 'resolved' })
      .eq('id', parsed.retryId);
  }

  return createSuccessResponse({
    retryItem,
    job,
    message: `Retry job executed with status '${job.status}'.`,
  });
});
