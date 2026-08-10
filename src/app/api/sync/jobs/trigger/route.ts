import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { SyncOrchestrator } from '@/lib/sync-engine/sync-orchestrator';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/validate-request';

const TriggerSyncJobSchema = z.object({
  connectorId: z.string().uuid(),
  institutionId: z.string().uuid(),
  triggeredBy: z.string().optional().default('admin_manual'),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const body = await req.json();
  const parsed = TriggerSyncJobSchema.parse(body);

  const orchestrator = new SyncOrchestrator();
  const job = await orchestrator.executeSyncJob({
    connectorId: parsed.connectorId,
    institutionId: parsed.institutionId,
    triggeredBy: parsed.triggeredBy,
  });

  return createSuccessResponse({
    job,
    message: `Sync job completed with status '${job.status}'. Processed ${job.processedRows || 0} rows.`,
  });
});
