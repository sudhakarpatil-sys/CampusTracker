import { ParsedSyncRecord } from '@/types/sync';

export interface NormalizedStudentEntity {
  institution_id: string;
  student_id: string;
  roll_number: string;
  full_name: string;
  official_email?: string;
  department_code?: string;
  class_name?: string;
}

export interface NormalizedAttendanceEntity {
  institution_id: string;
  roll_number: string;
  subject_code: string;
  class_date: string;
  status: 'present' | 'absent' | 'excused';
}

export interface NormalizedInternalMarkEntity {
  institution_id: string;
  roll_number: string;
  subject_code: string;
  test_name: string;
  max_marks: number;
  marks_obtained: number;
}

export class NormalizationLayer {
  public normalizeStudents(institutionId: string, records: ParsedSyncRecord[]): NormalizedStudentEntity[] {
    return records.map((r) => ({
      institution_id: institutionId,
      student_id: (r.studentId || r.rollNumber || '').trim().toUpperCase(),
      roll_number: (r.rollNumber || '').trim().toUpperCase(),
      full_name: (r.fullName || '').trim(),
      official_email: r.officialEmail ? r.officialEmail.trim().toLowerCase() : undefined,
      department_code: r.departmentCode ? r.departmentCode.trim().toUpperCase() : undefined,
      class_name: r.classCohort ? r.classCohort.trim() : undefined,
    }));
  }

  public normalizeAttendance(institutionId: string, records: ParsedSyncRecord[]): NormalizedAttendanceEntity[] {
    return records.map((r) => ({
      institution_id: institutionId,
      roll_number: (r.rollNumber || '').trim().toUpperCase(),
      subject_code: (r.subjectCode || '').trim().toUpperCase(),
      class_date: (r.classDate || '').trim(),
      status: r.status || 'present',
    }));
  }

  public normalizeInternalMarks(institutionId: string, records: ParsedSyncRecord[]): NormalizedInternalMarkEntity[] {
    return records.map((r) => ({
      institution_id: institutionId,
      roll_number: (r.rollNumber || '').trim().toUpperCase(),
      subject_code: (r.subjectCode || '').trim().toUpperCase(),
      test_name: (r.testName || '').trim(),
      max_marks: Number(r.maxMarks || 0),
      marks_obtained: Number(r.marksObtained || 0),
    }));
  }
}
