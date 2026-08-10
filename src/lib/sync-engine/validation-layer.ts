import { z } from 'zod';
import { RawSyncRecord, ParsedSyncRecord } from '@/types/sync';

export const RawStudentSyncSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  studentId: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  officialEmail: z.string().email('Invalid official email format').optional().or(z.literal('')),
  departmentCode: z.string().optional(),
  classCohort: z.string().optional(),
});

export const RawAttendanceSyncSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  subjectCode: z.string().min(1, 'Subject code is required'),
  classDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['present', 'absent', 'excused']),
});

export const RawInternalMarksSyncSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  subjectCode: z.string().min(1, 'Subject code is required'),
  testName: z.string().min(1, 'Test name is required'),
  maxMarks: z.number().positive('Max marks must be greater than 0'),
  marksObtained: z.number().nonnegative('Marks obtained cannot be negative'),
});

export const RawSemesterResultSyncSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  semester: z.number().int().min(1).max(12),
  sgpa: z.number().min(0).max(10),
  cgpa: z.number().min(0).max(10),
  backlogCount: z.number().int().nonnegative().default(0),
  resultStatus: z.enum(['PASS', 'FAIL', 'ATKT', 'WITHHELD']).default('PASS'),
});

export interface ValidationResult {
  validRecords: ParsedSyncRecord[];
  invalidRecords: Array<{
    sourceRowNumber: number;
    rawData: Record<string, any>;
    failureReason: string;
  }>;
}

export class ValidationLayer {
  public validateRecords(
    records: RawSyncRecord[],
    schema: z.ZodSchema<any>,
    mapping: Record<string, string>
  ): ValidationResult {
    const validRecords: ParsedSyncRecord[] = [];
    const invalidRecords: Array<{ sourceRowNumber: number; rawData: Record<string, any>; failureReason: string }> = [];

    for (const record of records) {
      try {
        const mappedData: Record<string, any> = {};

        // Apply field mappings
        Object.entries(mapping).forEach(([sourceCol, targetKey]) => {
          if (record.data[sourceCol] !== undefined) {
            let val = record.data[sourceCol];
            // Type conversions
            if (['maxMarks', 'marksObtained', 'semester', 'sgpa', 'cgpa', 'backlogCount'].includes(targetKey)) {
              const num = Number(val);
              val = isNaN(num) ? val : num;
            }
            mappedData[targetKey] = val;
          }
        });

        const parsed = schema.parse(mappedData);
        validRecords.push({
          ...parsed,
          _sourceRowNumber: record.sourceRowNumber,
        });
      } catch (err: any) {
        let reason = 'Validation failed';
        if (err instanceof z.ZodError) {
          reason = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
        } else if (err.message) {
          reason = err.message;
        }

        invalidRecords.push({
          sourceRowNumber: record.sourceRowNumber,
          rawData: record.data,
          failureReason: reason,
        });
      }
    }

    return { validRecords, invalidRecords };
  }
}
