import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/validate-request';

const UpdateConnectorSchema = z.object({
  name: z.string().min(1).optional(),
  config: z.record(z.any()).optional(),
  fieldMappings: z.array(
    z.object({
      sourceColumn: z.string(),
      targetField: z.string(),
      isRequired: z.boolean().optional(),
      transform: z.enum(['trim', 'uppercase', 'date_iso', 'number']).optional(),
    })
  ).optional(),
  syncFrequency: z.enum(['manual', 'hourly', 'daily', 'weekly']).optional(),
  isActive: z.boolean().optional(),
  healthStatus: z.enum([
    'CONNECTED',
    'DISCONNECTED',
    'AUTH_FAILED',
    'SHEET_NOT_FOUND',
    'PERMISSION_DENIED',
    'RATE_LIMITED',
    'NETWORK_ERROR',
    'RETRYING',
  ]).optional(),
});

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const connectorId = params.id;
  if (!connectorId) {
    throw ApiError.validation('Missing connector ID parameter');
  }

  const body = await req.json();
  const parsed = UpdateConnectorSchema.parse(body);

  const supabase = createAdminClient();
  const patchData: Record<string, any> = {};

  if (parsed.name !== undefined) patchData.name = parsed.name;
  if (parsed.config !== undefined) patchData.config = parsed.config;
  if (parsed.fieldMappings !== undefined) patchData.field_mappings = parsed.fieldMappings;
  if (parsed.syncFrequency !== undefined) patchData.sync_frequency = parsed.syncFrequency;
  if (parsed.isActive !== undefined) patchData.is_active = parsed.isActive;
  if (parsed.healthStatus !== undefined) patchData.health_status = parsed.healthStatus;
  patchData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('sync_connectors')
    .update(patchData)
    .eq('id', connectorId)
    .select('*')
    .single();

  if (error) {
    throw ApiError.internal(`Failed to update sync connector: ${error.message}`);
  }

  return createSuccessResponse(data);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const connectorId = params.id;
  if (!connectorId) {
    throw ApiError.validation('Missing connector ID parameter');
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('sync_connectors')
    .delete()
    .eq('id', connectorId);

  if (error) {
    throw ApiError.internal(`Failed to delete sync connector: ${error.message}`);
  }

  return createSuccessResponse({ id: connectorId, deleted: true });
});
