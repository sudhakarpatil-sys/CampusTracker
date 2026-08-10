import { createAdminClient } from '@/lib/supabase/admin';

export interface QuarantineRecordInput {
  syncJobId: string;
  institutionId: string;
  rawData: Record<string, any>;
  failureReason: string;
}

export class QuarantineManager {
  public async quarantineRows(inputs: QuarantineRecordInput[]): Promise<{ count: number; error?: string }> {
    if (inputs.length === 0) return { count: 0 };

    try {
      const supabase = createAdminClient();
      const insertRows = inputs.map((item) => ({
        sync_job_id: item.syncJobId,
        institution_id: item.institutionId,
        raw_data: item.rawData,
        failure_reason: item.failureReason,
        is_resolved: false,
      }));

      const { data, error } = await supabase.from('sync_quarantine_rows').insert(insertRows).select('id');
      if (error) {
        return { count: 0, error: error.message };
      }

      return { count: data ? data.length : 0 };
    } catch (err: any) {
      return { count: 0, error: err.message || 'Quarantine store exception' };
    }
  }
}
