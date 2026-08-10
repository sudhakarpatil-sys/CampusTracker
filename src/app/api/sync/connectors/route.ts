import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, requireRole } from '@/lib/validate-request';

const CreateConnectorSchema = z.object({
  institutionId: z.string().uuid(),
  name: z.string().min(1, 'Connector name is required'),
  connectorType: z.enum(['google_sheets', 'excel', 'csv', 'erp_api']),
  config: z.record(z.any()),
  fieldMappings: z.array(
    z.object({
      sourceColumn: z.string(),
      targetField: z.string(),
      isRequired: z.boolean().optional(),
    })
  ).default([]),
  syncFrequency: z.enum(['manual', 'hourly', 'daily', 'weekly']).default('daily'),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireRole(supabaseAuth, ['admin']);

  const { searchParams } = new URL(req.url);
  const institutionId = searchParams.get('institutionId');

  if (!institutionId) {
    throw ApiError.validation('Missing institutionId query parameter');
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sync_connectors')
    .select('*')
    .eq('institution_id', institutionId)
    .order('created_at', { ascending: false });

  if (error) {
    throw ApiError.internal(`Failed to fetch connectors: ${error.message}`);
  }

  return createSuccessResponse(data || []);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireRole(supabaseAuth, ['admin']);

  const body = await req.json();
  const parsed = CreateConnectorSchema.parse(body);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('sync_connectors')
    .insert({
      institution_id: parsed.institutionId,
      name: parsed.name,
      connector_type: parsed.connectorType,
      config: parsed.config,
      field_mappings: parsed.fieldMappings,
      sync_frequency: parsed.syncFrequency,
    })
    .select('*')
    .single();

  if (error) {
    throw ApiError.internal(`Failed to create sync connector: ${error.message}`);
  }

  return createSuccessResponse(data, 201);
});
