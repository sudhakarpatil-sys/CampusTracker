import { RawSyncRecord, ParsedSyncRecord } from '@/types/sync';
import { AcademicEventEnvelope, AcademicEventBus } from '@/lib/events/event-bus';
import { createAdminClient } from '@/lib/supabase/admin';

export interface DatasetAdapterContext {
  institutionId: string;
  connectorId: string;
  fieldMappings: Record<string, string>;
  syncJobId: string;
}

export interface AdapterValidationResult {
  validEntities: any[];
  quarantineRows: Array<{
    sourceRowNumber: number;
    rawData: Record<string, any>;
    failureReason: string;
  }>;
}

export interface IDatasetAdapter<T = any> {
  readonly datasetType: string;
  readonly targetTable: string;

  validateRawRecords(records: RawSyncRecord[], ctx: DatasetAdapterContext): Promise<AdapterValidationResult>;
  normalizeEntities(records: any[], ctx: DatasetAdapterContext): Promise<T[]>;
  computeRecordHash(entity: T): string;
  upsertEntities(entities: T[], ctx: DatasetAdapterContext): Promise<{ inserted: number; updated: number }>;
  publishDomainEvents(entities: T[], ctx: DatasetAdapterContext): Promise<void>;
}

export class StudentDatasetAdapter implements IDatasetAdapter {
  readonly datasetType = 'student_master';
  readonly targetTable = 'student_master';

  async validateRawRecords(records: RawSyncRecord[], ctx: DatasetAdapterContext): Promise<AdapterValidationResult> {
    const validEntities: any[] = [];
    const quarantineRows: AdapterValidationResult['quarantineRows'] = [];

    for (const rec of records) {
      const rollNumber = rec.data[ctx.fieldMappings.rollNumber || 'Roll Number'] || rec.data['roll_number'];
      const fullName = rec.data[ctx.fieldMappings.fullName || 'Student Name'] || rec.data['full_name'];

      if (!rollNumber || !fullName) {
        quarantineRows.push({
          sourceRowNumber: rec.sourceRowNumber,
          rawData: rec.data,
          failureReason: 'Missing required rollNumber or fullName',
        });
      } else {
        validEntities.push({
          rollNumber: String(rollNumber).trim(),
          studentId: String(rec.data[ctx.fieldMappings.studentId || 'Enrollment No'] || rollNumber).trim(),
          fullName: String(fullName).trim(),
          officialEmail: rec.data[ctx.fieldMappings.officialEmail || 'Email'] || null,
        });
      }
    }

    return { validEntities, quarantineRows };
  }

  async normalizeEntities(records: any[], ctx: DatasetAdapterContext): Promise<any[]> {
    return records.map((r) => ({
      institution_id: ctx.institutionId,
      student_id: r.studentId.toUpperCase(),
      roll_number: r.rollNumber.toUpperCase(),
      full_name: r.fullName,
      official_email: r.officialEmail ? r.officialEmail.toLowerCase() : null,
    }));
  }

  computeRecordHash(entity: any): string {
    return `${entity.student_id}_${entity.roll_number}_${entity.full_name}`;
  }

  async upsertEntities(entities: any[], ctx: DatasetAdapterContext): Promise<{ inserted: number; updated: number }> {
    if (entities.length === 0) return { inserted: 0, updated: 0 };
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('student_master')
      .upsert(entities, { onConflict: 'institution_id,student_id' })
      .select('id');

    if (error) throw new Error(`StudentAdapter upsert failed: ${error.message}`);
    return { inserted: data ? data.length : entities.length, updated: 0 };
  }

  async publishDomainEvents(entities: any[], ctx: DatasetAdapterContext): Promise<void> {
    if (entities.length > 0) {
      AcademicEventBus.publish('StudentAdded', ctx.institutionId, { count: entities.length });
    }
  }
}

export class AttendanceDatasetAdapter implements IDatasetAdapter {
  readonly datasetType = 'attendance';
  readonly targetTable = 'attendance_records';

  async validateRawRecords(records: RawSyncRecord[], ctx: DatasetAdapterContext): Promise<AdapterValidationResult> {
    const validEntities: any[] = [];
    const quarantineRows: AdapterValidationResult['quarantineRows'] = [];

    for (const rec of records) {
      const rollNumber = rec.data[ctx.fieldMappings.rollNumber || 'Roll Number'] || rec.data['roll_number'];
      const subjectCode = rec.data[ctx.fieldMappings.subjectCode || 'Subject Code'] || rec.data['subject_code'];
      const classDate = rec.data[ctx.fieldMappings.classDate || 'Date'] || rec.data['class_date'];
      const status = (rec.data[ctx.fieldMappings.status || 'Status'] || rec.data['status'] || 'present').toLowerCase();

      if (!rollNumber || !subjectCode || !classDate) {
        quarantineRows.push({
          sourceRowNumber: rec.sourceRowNumber,
          rawData: rec.data,
          failureReason: 'Missing rollNumber, subjectCode, or classDate',
        });
      } else {
        validEntities.push({
          rollNumber: String(rollNumber).trim(),
          subjectCode: String(subjectCode).trim(),
          classDate: String(classDate).trim(),
          status: ['present', 'absent', 'excused'].includes(status) ? status : 'present',
        });
      }
    }

    return { validEntities, quarantineRows };
  }

  async normalizeEntities(records: any[], ctx: DatasetAdapterContext): Promise<any[]> {
    return records.map((r) => ({
      institution_id: ctx.institutionId,
      roll_number: r.rollNumber.toUpperCase(),
      subject_code: r.subjectCode.toUpperCase(),
      class_date: r.classDate,
      status: r.status,
    }));
  }

  computeRecordHash(entity: any): string {
    return `${entity.roll_number}_${entity.subject_code}_${entity.class_date}_${entity.status}`;
  }

  async upsertEntities(entities: any[], ctx: DatasetAdapterContext): Promise<{ inserted: number; updated: number }> {
    return { inserted: entities.length, updated: 0 };
  }

  async publishDomainEvents(entities: any[], ctx: DatasetAdapterContext): Promise<void> {
    if (entities.length > 0) {
      AcademicEventBus.publish('AttendanceUpdated', ctx.institutionId, { count: entities.length });
    }
  }
}

export class DatasetAdapterRegistry {
  private static adapters = new Map<string, IDatasetAdapter>([
    ['student_master', new StudentDatasetAdapter()],
    ['attendance', new AttendanceDatasetAdapter()],
  ]);

  public static getAdapter(datasetType: string): IDatasetAdapter {
    const adapter = this.adapters.get(datasetType);
    if (!adapter) {
      return this.adapters.get('student_master')!;
    }
    return adapter;
  }
}
