import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError, withErrorHandler, createSuccessResponse } from '@/lib/api-error';
import { standardRateLimiter } from '@/lib/rate-limit';
import { SheetConnector } from '@/lib/sync-engine/sheet-connector';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/validate-request';

const TestConnectorSchema = z.object({
  connectorType: z.enum(['google_sheets', 'excel', 'csv', 'erp_api']).default('google_sheets'),
  config: z.object({
    sheetUrl: z.string().optional(),
    spreadsheetId: z.string().optional(),
    gid: z.string().optional(),
    worksheetName: z.string().optional(),
    headerRowIndex: z.number().optional().default(1),
    dataStartRowIndex: z.number().optional().default(2),
  }),
  fieldMappings: z.array(
    z.object({
      sourceColumn: z.string(),
      targetField: z.string(),
      isRequired: z.boolean().optional(),
    })
  ).optional().default([]),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  standardRateLimiter.check(req);
  const supabaseAuth = createClient();
  await requireAuth(supabaseAuth);

  const body = await req.json();
  const parsed = TestConnectorSchema.parse(body);

  if (parsed.connectorType === 'google_sheets') {
    const sheetConnector = new SheetConnector();
    const result = await sheetConnector.healthCheck(parsed.config);

    if (!result.isHealthy) {
      return createSuccessResponse({
        isHealthy: false,
        status: result.status,
        latencyMs: result.latencyMs || 0,
        message: result.errorMessage || 'Connection test failed',
      });
    }

    // Try fetching preview rows if test passed
    try {
      const records = await sheetConnector.fetchData(parsed.config);
      const firstRecord = records[0];
      const headers = records.length > 0 && firstRecord ? Object.keys(firstRecord.data) : [];
      return createSuccessResponse({
        isHealthy: true,
        status: 'CONNECTED',
        latencyMs: result.latencyMs || 0,
        message: `Successfully connected. Previewed ${records.length} data rows with ${headers.length} columns.`,
        previewRows: records.slice(0, 5),
        detectedHeaders: headers,
        metadata: result.metadata,
      });
    } catch (fetchErr: any) {
      return createSuccessResponse({
        isHealthy: false,
        status: 'CONFIGURATION_ERROR',
        latencyMs: result.latencyMs || 0,
        message: `Connection opened but data reading failed: ${fetchErr.message || 'CSV parse error'}`,
      });
    }
  }

  return createSuccessResponse({
    isHealthy: true,
    status: 'CONNECTED',
    latencyMs: 12,
    message: `Connector test simulated successfully for type '${parsed.connectorType}'.`,
  });
});
