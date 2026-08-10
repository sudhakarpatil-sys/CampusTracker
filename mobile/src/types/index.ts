export type UserRole = "student" | "faculty" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  onboarding_completed?: boolean;
  department?: string;
  semester?: number;
  roll_number?: string;
  created_at?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color?: string;
  credits?: number;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  subject_id: string;
  class_date: string;
  status: "present" | "absent" | "excused" | "cancelled";
  subjects?: Subject;
}

export interface AttendanceStats {
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  excusedClasses: number;
  percentage: number;
  isPassing: boolean;
}

export interface TimetableSlot {
  id: string;
  subject: string;
  code: string;
  time: string;
  room: string;
  faculty: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  status: "completed" | "ongoing" | "upcoming";
  studentsCount?: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: "high" | "medium" | "low";
  isSubmitted?: boolean;
  description?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  author: string;
  postedTime: string;
  fileSize?: string;
  readTime?: string;
  content?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  author: string;
  targetClass: string;
  time: string;
  content: string;
  isUrgent?: boolean;
  publishedAt?: string;
}

export interface SmartStackItem {
  id: string;
  type: "class" | "assignment" | "announcement" | "warning";
  title: string;
  subtitle: string;
  time: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  actionText?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  type: "attendance" | "assignment" | "note" | "announcement" | "result";
}
