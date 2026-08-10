import { z } from 'zod';
import { SheetConnector } from './sheet-connector';
import { ExcelConnector } from './excel-connector';
import { ValidationLayer, RawStudentSyncSchema, RawAttendanceSyncSchema, RawInternalMarksSyncSchema } from './validation-layer';
import { NormalizationLayer } from './normalization-layer';
import { QuarantineManager } from './quarantine-manager';
import { createAdminClient } from '@/lib/supabase/admin';
import { SyncJob, SyncStatus } from '@/types/sync';

export interface ExecuteSyncOptions {
  connectorId: string;
  institutionId: string;
  triggeredBy?: string;
}

export class SyncOrchestrator {
  private sheetConnector = new SheetConnector();
  private excelConnector = new ExcelConnector();
  private validationLayer = new ValidationLayer();
  private normalizationLayer = new NormalizationLayer();
  private quarantineManager = new QuarantineManager();

  public async executeSyncJob(options: ExecuteSyncOptions): Promise<SyncJob> {
    const startTime = Date.now();
    const supabase = createAdminClient();

    // 1. Fetch Connector Configuration
    const { data: connector, error: connErr } = await supabase
      .from('sync_connectors')
      .select('*')
      .eq('id', options.connectorId)
      .eq('institution_id', options.institutionId)
      .single();

    if (connErr || !connector) {
      throw new Error(`Sync connector not found or inactive: ${connErr?.message || options.connectorId}`);
    }

    // 2. Create Sync Job Record
    const { data: job, error: jobErr } = await supabase
      .from('sync_jobs')
      .insert({
        connector_id: options.connectorId,
        institution_id: options.institutionId,
        status: 'processing',
        triggered_by: options.triggeredBy || 'scheduled_cron',
        started_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (jobErr || !job) {
      throw new Error(`Failed to create sync job record: ${jobErr?.message}`);
    }

    const jobId = job.id;
    let processedRows = 0;
    let insertedRows = 0;
    let updatedRows = 0;
    let quarantinedRows = 0;
    let finalStatus: SyncStatus = 'completed';
    let errorMessage: string | undefined;

    try {
      // 3. Fetch raw data via appropriate connector plugin
      let rawRecords = [];
      if (connector.connector_type === 'google_sheets') {
        rawRecords = await this.sheetConnector.fetchData(connector.config);
      } else if (connector.connector_type === 'excel' || connector.connector_type === 'csv') {
        rawRecords = await this.excelConnector.fetchData(connector.config);
      } else {
        throw new Error(`Unsupported connector type: ${connector.connector_type}`);
      }

      processedRows = rawRecords.length;

      // 4. Determine Schema & Field Mappings
      const targetEntity = connector.config.targetEntity || 'student_master';
      const mapping = connector.field_mappings || {};
      let schema: z.ZodSchema<any> = RawStudentSyncSchema;

      if (targetEntity === 'attendance') {
        schema = RawAttendanceSyncSchema;
      } else if (targetEntity === 'internal_marks') {
        schema = RawInternalMarksSyncSchema;
      }

      // 5. Run Validation
      const { validRecords, invalidRecords } = this.validationLayer.validateRecords(rawRecords, schema, mapping);

      // 6. Quarantine Invalid Rows
      if (invalidRecords.length > 0) {
        quarantinedRows = invalidRecords.length;
        await this.quarantineManager.quarantineRows(
          invalidRecords.map((r) => ({
            syncJobId: jobId,
            institutionId: options.institutionId,
            rawData: r.rawData,
            failureReason: r.failureReason,
          }))
        );
      }

      // 7. Normalize & Upsert Valid Records
      if (targetEntity === 'student_master') {
        const normalized = this.normalizationLayer.normalizeStudents(options.institutionId, validRecords);
        if (normalized.length > 0) {
          const { data: upserted, error: upsertErr } = await supabase
            .from('student_master')
            .upsert(normalized, { onConflict: 'institution_id,student_id' })
            .select('id');

          if (upsertErr) throw upsertErr;
          insertedRows = upserted ? upserted.length : normalized.length;
        }
      }

      if (quarantinedRows > 0) {
        finalStatus = processedRows === quarantinedRows ? 'failed' : 'partial_warning';
      }
    } catch (err: any) {
      finalStatus = 'failed';
      errorMessage = err.message || 'Unknown sync engine error';
    }

    const executionTimeMs = Date.now() - startTime;

    // 8. Update Sync Job Status & Connector Timestamp
    const { data: updatedJob } = await supabase
      .from('sync_jobs')
      .update({
        status: finalStatus,
        processed_rows: processedRows,
        inserted_rows: insertedRows,
        updated_rows: updatedRows,
        quarantined_rows: quarantinedRows,
        error_log: errorMessage || null,
        execution_time_ms: executionTimeMs,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select('*')
      .single();

    await supabase
      .from('sync_connectors')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', options.connectorId);

    return updatedJob || job;
  }
}
