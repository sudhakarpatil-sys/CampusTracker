export interface Institution {
  id: string;
  name: string;
  code: string;
  domain?: string;
  logoUrl?: string;
  primaryColor?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentMaster {
  id: string;
  institutionId: string;
  departmentId?: string;
  classId?: string;
  studentId: string;
  rollNumber: string;
  fullName: string;
  officialEmail?: string;
  personalEmail?: string;
  phoneNumber?: string;
  userId?: string;
  isActivated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InternalMark {
  id: string;
  institutionId: string;
  studentMasterId: string;
  subjectId?: string;
  testName: string;
  maxMarks: number;
  marksObtained: number;
  weightagePercent?: number;
  syncJobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SemesterResult {
  id: string;
  institutionId: string;
  studentMasterId: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits?: number;
  earnedCredits?: number;
  backlogCount: number;
  resultStatus: 'PASS' | 'FAIL' | 'ATKT' | 'WITHHELD';
  syncJobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafeLeaveCalculation {
  subjectId: string;
  subjectName: string;
  currentAttendancePercentage: number;
  targetPercentage: number;
  totalLecturesHeld: number;
  totalLecturesAttended: number;
  safeLeavesRemaining: number;
  status: 'safe' | 'warning' | 'critical';
  guidanceText: string;
}

export interface AcademicCalendarEvent {
  id: string;
  institutionId: string;
  title: string;
  description?: string;
  eventType: 'exam' | 'holiday' | 'sports' | 'cultural' | 'academic' | 'general';
  startDate: string;
  endDate?: string;
  isHoliday: boolean;
  createdAt: string;
  updatedAt: string;
}
