import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarCheck2,
  ListChecks,
  CalendarClock,
  NotebookText,
  CalendarDays,
  GraduationCap,
  BarChart3,
  Settings,
  BookOpen,
  CheckSquare,
  PartyPopper,
  Megaphone,
  Bell,
  User,
  FolderKanban,
} from "lucide-react";

export const APP_NAME = "CampusTracker";
export const APP_DESCRIPTION =
  "Attendance, assignments, timetable, exams, and notes — all in one calm, private place.";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Timetable", href: "/timetable", icon: CalendarClock },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck2 },
  { label: "Subjects", href: "/subjects", icon: BookOpen },
  { label: "Assignments", href: "/assignments", icon: ListChecks },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Notes", href: "/notes", icon: NotebookText },
  { label: "Resources", href: "/resources", icon: FolderKanban },
  { label: "Events", href: "/events", icon: PartyPopper },
  { label: "Exams", href: "/exams", icon: GraduationCap },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Business Administration",
  "Commerce",
  "Other",
];

export const SEMESTERS = Array.from({ length: 8 }, (_, i) => String(i + 1));

export const DEFAULT_WIDGET_ORDER = [
  "todays-schedule",
  "attendance",
  "academic-insights",
  "assignments",
  "upcoming-exams",
  "events",
  "internal-marks",
  "tasks",
  "notes",
  "recent-activity",
] as const;

// ─────────────────────────────────────────────────────────────────────────
// Phase 2 — academic management constants
// ─────────────────────────────────────────────────────────────────────────

export const SUBJECT_COLORS = [
  "#5B7FFF", // primary ink-blue
  "#F5A623", // accent marigold
  "#3DD68C", // success green
  "#E5484D", // destructive red
  "#B892FF", // violet
  "#22C1D6", // teal
  "#FF8AB8", // pink
  "#8B92A6", // slate
] as const;

export const WEEKDAYS = [
  { value: 1, short: "Mon", label: "Monday" },
  { value: 2, short: "Tue", label: "Tuesday" },
  { value: 3, short: "Wed", label: "Wednesday" },
  { value: 4, short: "Thu", label: "Thursday" },
  { value: 5, short: "Fri", label: "Friday" },
  { value: 6, short: "Sat", label: "Saturday" },
  { value: 7, short: "Sun", label: "Sunday" },
] as const;

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export const ASSIGNMENT_STATUSES = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "submitted", label: "Submitted" },
  { value: "completed", label: "Completed" },
] as const;

export const EVENT_CATEGORIES = [
  { value: "college", label: "College event" },
  { value: "workshop", label: "Workshop" },
  { value: "hackathon", label: "Hackathon" },
  { value: "club", label: "Club activity" },
  { value: "personal", label: "Personal reminder" },
] as const;

export const PREP_STATUSES = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "ready", label: "Ready" },
] as const;

export const TIMETABLE_HOURS = { start: 7, end: 21 }; // 7 AM – 9 PM grid
