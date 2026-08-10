"use client";

import * as React from "react";
import { 
  Calendar as CalendarIcon, 
  FileText, 
  BookOpen, 
  Award, 
  Plus, 
  Search, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  GraduationCap, 
  Filter, 
  Check, 
  X,
  ChevronRight,
  BarChart3,
  Megaphone
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useAttendance } from "@/hooks/use-attendance";
import { useTimetable } from "@/hooks/use-timetable";
import { useAssignments } from "@/hooks/use-assignments";
import { useNotes } from "@/hooks/use-notes";
import { useNotifications } from "@/hooks/use-notifications";
import { useExams } from "@/hooks/use-exams";
import { useSubjects } from "@/hooks/use-subjects";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { MobileBottomNav, type MobileTab } from "@/components/mobile/mobile-bottom-nav";
import { SmartStack, type SmartStackItem } from "@/components/mobile/smart-stack";
import { AttendanceProgressRing } from "@/components/mobile/attendance-progress-ring";
import { SafeLeaveCalculator } from "@/components/mobile/safe-leave-calculator";
import { ClassTimelineCard, type ClassItem } from "@/components/mobile/class-timeline-card";
import { AssignmentCard } from "@/components/mobile/assignment-card";
import { NoteCard } from "@/components/mobile/note-card";
import { NotificationCard } from "@/components/mobile/notification-card";
import { MobileModal } from "@/components/mobile/mobile-modal";
import { MobileDashboardSkeleton } from "@/components/mobile/mobile-skeleton";
import { MobileEmptyState } from "@/components/mobile/mobile-empty-state";
import { MobileErrorState } from "@/components/mobile/mobile-error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Assignment, Note } from "@/types/database.types";

import { useAnnouncementsStore, type BroadcastAnnouncement } from "@/lib/announcements-store";

interface StudentAppProps {
  onRoleSwitch?: (role: "student" | "faculty" | "admin" | "onboarding") => void;
}

export function StudentApp({ onRoleSwitch }: StudentAppProps) {
  const { user, profile, isLoading: isUserLoading } = useUser();
  const { overallStats, statsBySubject, isLoading: isAttendanceLoading, refetch: refreshAttendance } = useAttendance();
  const { slots, isLoading: isTimetableLoading } = useTimetable();
  const { assignments, isLoading: isAssignmentsLoading } = useAssignments();
  const { notes, isLoading: isNotesLoading } = useNotes();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const { exams } = useExams();
  const { subjects } = useSubjects();
  const { announcements } = useAnnouncementsStore();

  // Active navigation tab
  const [activeTab, setActiveTab] = React.useState<MobileTab>("home");
  
  // UI State Modals
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState<BroadcastAnnouncement | null>(null);
  const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | null>(null);
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);
  const [showSafeLeaveModal, setShowSafeLeaveModal] = React.useState(false);
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [showFABMenu, setShowFABMenu] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<number>(new Date().getDay() || 7);
  const [academicsSubTab, setAcademicsSubTab] = React.useState<"attendance" | "marks" | "exams" | "results">("attendance");
  const [assignmentFilter, setAssignmentFilter] = React.useState<"all" | "pending" | "submitted" | "graded">("all");

  // Notification Preferences state
  const [notifPrefs, setNotifPrefs] = React.useState({
    classReminders: true,
    assignmentReminders: true,
    announcementAlerts: true,
    attendanceAlerts: true,
    newNotes: true,
    aiUpdates: true,
  });

  // Calculate Safe-Leave Allowance
  const overallAttended = overallStats?.present || 23;
  const overallTotal = overallStats?.total || 26;
  const overallPercentage = overallStats?.percentage || 88;
  const safeLeaves = Math.max(0, Math.floor((overallAttended - 0.75 * overallTotal) / 0.25));

  // Compute Smart Stack items dynamically
  const smartStackItems = React.useMemo<SmartStackItem[]>(() => {
    const stack: SmartStackItem[] = [];

    // Priority Item: Latest Faculty Broadcast
    if (announcements.length > 0) {
      const topAnn = announcements[0];
      if (topAnn) {
        stack.push({
          id: `stack-ann-${topAnn.id}`,
          type: "assignment",
          title: `Faculty Broadcast: ${topAnn.title}`,
          subtitle: `${topAnn.subjectCode} • ${topAnn.message}`,
          badge: "New Broadcast",
          badgeType: "rose",
          actionLabel: "View All",
          onAction: () => setActiveTab("notifications"),
          timestamp: "Live Sync",
        });
      }
    }

    // Item 1: Attendance Safe Leave Notice
    stack.push({
      id: "stack-att",
      type: "attendance",
      title: `Official Attendance: ${Math.round(overallPercentage)}%`,
      subtitle: safeLeaves > 0 
        ? `You have ${safeLeaves} safe leave${safeLeaves > 1 ? "s" : ""} remaining above the 75% college target.`
        : "Attendance is close to 75% target threshold. Attend upcoming classes.",
      badge: safeLeaves > 0 ? "Safe Buffer" : "Action Needed",
      badgeType: safeLeaves > 0 ? "emerald" : "amber",
      actionLabel: "Simulate Leave",
      onAction: () => setShowSafeLeaveModal(true),
      timestamp: "Official Sync",
    });

    // Item 2: Upcoming Assignment
    const upcomingAssign = assignments.find(a => a.status !== "completed" && a.status !== "submitted");
    if (upcomingAssign) {
      stack.push({
        id: "stack-assign",
        type: "assignment",
        title: `Assignment Due: ${upcomingAssign.title}`,
        subtitle: `Due ${upcomingAssign.due_date || "Soon"} • Priority: ${upcomingAssign.priority.toUpperCase()}`,
        badge: "Due Soon",
        badgeType: upcomingAssign.priority === "high" ? "rose" : "amber",
        actionLabel: "View Assignment",
        onAction: () => setSelectedAssignment(upcomingAssign),
        timestamp: "Academic Task",
      });
    }

    // Item 3: Upcoming Exam
    if (exams && exams.length > 0) {
      const nextExam = exams[0];
      if (nextExam) {
        stack.push({
          id: "stack-exam",
          type: "exam",
          title: `Upcoming Exam: ${nextExam.exam_date}`,
          subtitle: `Venue: ${nextExam.venue || "Main Hall"} • Status: ${nextExam.preparation_status.replace("_", " ")}`,
          badge: "Exam Alert",
          badgeType: "rose",
          actionLabel: "Exam Details",
          onAction: () => {
            setActiveTab("academics");
            setAcademicsSubTab("exams");
          },
          timestamp: "Exam Schedule",
        });
      }
    }

    return stack;
  }, [announcements, overallPercentage, safeLeaves, assignments, exams]);

  // Compute Today's Schedule Timeline Cards
  const todayClasses = React.useMemo<ClassItem[]>(() => {
    if (!slots || slots.length === 0) {
      // Mock fallback matching reference image
      return [
        {
          id: "cls-1",
          subjectName: "Data Structures",
          subjectCode: "CS301",
          facultyName: "Prof. A. K. Sharma",
          classroom: "Room 402",
          startTime: "09:00 AM",
          endTime: "10:00 AM",
          status: "ongoing",
          color: "#8B5CF6",
        },
        {
          id: "cls-2",
          subjectName: "Database Systems",
          subjectCode: "CS302",
          facultyName: "Prof. P. R. Mehta",
          classroom: "Room 305",
          startTime: "11:00 AM",
          endTime: "12:00 PM",
          status: "upcoming",
          color: "#3B82F6",
        },
        {
          id: "cls-3",
          subjectName: "Computer Networks",
          subjectCode: "CS303",
          facultyName: "Prof. S. Verma",
          classroom: "Room 201",
          startTime: "01:30 PM",
          endTime: "02:30 PM",
          status: "upcoming",
          color: "#10B981",
        },
      ];
    }

    const currentHour = new Date().getHours();
    return slots
      .filter((s) => s.day_of_week === selectedDay)
      .map((s) => {
        const startH = parseInt(s.start_time.split(":")[0] || "9", 10);
        let status: ClassItem["status"] = "upcoming";
        if (currentHour === startH) status = "ongoing";
        else if (currentHour > startH) status = "completed";

        const matchedSub = subjects.find(sub => sub.id === s.subject_id);
        return {
          id: s.id,
          subjectName: matchedSub?.name || s.faculty_name || "Lecture",
          subjectCode: matchedSub?.code,
          facultyName: s.faculty_name || matchedSub?.faculty_name || "Faculty",
          classroom: s.classroom || matchedSub?.classroom,
          startTime: s.start_time,
          endTime: s.end_time,
          status,
          color: matchedSub?.color || "#8B5CF6",
        };
      });
  }, [slots, selectedDay, subjects]);

  // Subject Summaries derived from subjects & statsBySubject
  const subjectSummariesList = React.useMemo(() => {
    return subjects.map((sub) => {
      const stats = statsBySubject.get(sub.id) || { present: 18, total: 20, percentage: 90, absent: 2, cancelled: 0 };
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        presents: stats.present,
        totalClasses: stats.total,
        percentage: stats.percentage,
      };
    });
  }, [subjects, statsBySubject]);

  const firstAssignment = assignments[0];

  return (
    <MobileShell
      unreadCount={unreadCount}
      onOpenSearch={() => setShowSearchModal(true)}
      onOpenNotifications={() => setActiveTab("notifications")}
      activeRole="student"
      onRoleSwitch={onRoleSwitch}
      bottomNav={
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          role="student"
          fabOpen={showFABMenu}
          onFabClick={() => setShowSafeLeaveModal(true)}
        />
      }
      modals={
        <>
          {/* Safe Leave Calculator Modal */}
          <MobileModal
            isOpen={showSafeLeaveModal}
            onClose={() => setShowSafeLeaveModal(false)}
            title="Safe-Leave Engine™"
          >
            <SafeLeaveCalculator
              attended={overallAttended}
              total={overallTotal}
              target={75}
              onClose={() => setShowSafeLeaveModal(false)}
            />
          </MobileModal>

          {/* Assignment Details Drawer */}
          <MobileModal
            isOpen={!!selectedAssignment}
            onClose={() => setSelectedAssignment(null)}
            title="Assignment Details"
          >
            {selectedAssignment && (
              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <h3 className="font-bold text-base text-white">{selectedAssignment.title}</h3>
                  <p className="text-purple-300 font-medium">Due: {selectedAssignment.due_date || "Soon"}</p>
                </div>
                <p className="leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {selectedAssignment.description || "Build a mini project using SQL and relational database concepts."}
                </p>
                <Button onClick={() => setSelectedAssignment(null)} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold h-10 rounded-xl">
                  Acknowledge & Close
                </Button>
              </div>
            )}
          </MobileModal>

          {/* Announcement Reader Drawer */}
          <MobileModal
            isOpen={!!selectedAnnouncement}
            onClose={() => setSelectedAnnouncement(null)}
            title="Class Announcement"
          >
            {selectedAnnouncement && (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                    {selectedAnnouncement.subjectCode} • {selectedAnnouncement.authorName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(selectedAnnouncement.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-white tracking-tight leading-snug break-words">
                    {selectedAnnouncement.title}
                  </h3>
                  <p className="text-[11px] text-purple-400 font-medium">
                    Official Faculty Broadcast ({selectedAnnouncement.subjectName})
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 leading-relaxed text-slate-200 text-xs break-all break-words whitespace-pre-wrap">
                  {selectedAnnouncement.message}
                </div>

                <Button 
                  type="button" 
                  onClick={() => setSelectedAnnouncement(null)} 
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold h-10 rounded-xl cursor-pointer"
                >
                  Close Announcement
                </Button>
              </div>
            )}
          </MobileModal>
        </>
      }
    >
      {/* ========================================================================= */}
      {/* TAB 1: STUDENT HOME DASHBOARD                                             */}
      {/* ========================================================================= */}
      {activeTab === "home" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Welcome Banner */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white font-display">
              Your Day At a Glance
            </h1>
            <p className="text-xs text-slate-400">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Student"}. Here is your official academic status.
            </p>
          </div>

          {/* Attendance Hero Gauge Card */}
          <AttendanceProgressRing
            percentage={overallPercentage}
            presents={overallAttended}
            totalClasses={overallTotal}
            absences={overallStats?.absent || 3}
            safeLeaves={safeLeaves}
            onViewDetails={() => {
              setActiveTab("academics");
              setAcademicsSubTab("attendance");
            }}
          />

          {/* Quick Access Pills Row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Timetable", icon: CalendarIcon, color: "text-purple-400 bg-purple-500/15 border-purple-500/20", tab: "timetable" as MobileTab },
              { label: "Notes", icon: FileText, color: "text-blue-400 bg-blue-500/15 border-blue-500/20", action: () => setSelectedNote(notes[0] || null) },
              { label: "Assignments", icon: BookOpen, color: "text-amber-400 bg-amber-500/15 border-amber-500/20", action: () => setSelectedAssignment(assignments[0] || null) },
              { label: "Results", icon: Award, color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20", tab: "academics" as MobileTab },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.tab ? setActiveTab(item.tab) : item.action?.();
                  }}
                  className="p-3 rounded-2xl bg-[#141923] border border-slate-800/80 hover:border-purple-500/40 flex flex-col items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                >
                  <div className={`p-2 rounded-xl border ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* CampusTracker Smart Stack Component */}
          <SmartStack items={smartStackItems} />

          {/* Official Class Announcements Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-blue-400" /> Class Announcements ({announcements.length})
              </h3>
              <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20">
                Official Broadcast
              </span>
            </div>

            <div className="space-y-2.5">
              {announcements.map((a) => (
                <div 
                  key={a.id} 
                  onClick={() => setSelectedAnnouncement(a)}
                  className="p-3.5 rounded-2xl bg-[#141923] border border-blue-500/25 hover:border-purple-500/50 space-y-1.5 relative shadow-lg cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                      {a.subjectCode} • {a.authorName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white leading-snug break-words">{a.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-normal line-clamp-2 break-all break-words">{a.message}</p>
                  <span className="block text-[10px] text-purple-400 font-semibold pt-1">Tap to read full broadcast &rarr;</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule Timeline Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" /> Today&apos;s Schedule
              </h3>
              <button 
                onClick={() => setActiveTab("timetable")} 
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
              >
                View All <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayClasses.map((item) => (
                <ClassTimelineCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Pending Assignments Preview Card */}
          {firstAssignment && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white tracking-tight">Pending Assignments</h3>
                <span className="text-xs font-semibold text-amber-400">{assignments.length} Due</span>
              </div>
              <AssignmentCard 
                assignment={firstAssignment} 
                onSelect={(a) => setSelectedAssignment(a)}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TIMETABLE & SCHEDULE                                               */}
      {/* ========================================================================= */}
      {activeTab === "timetable" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-display">Official Timetable</h1>
              <p className="text-xs text-slate-400">Ingested from Institution Academic System</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
              Week View
            </span>
          </div>

          {/* Day Selector Ribbon */}
          <div className="flex items-center justify-between bg-[#141923] p-1.5 rounded-2xl border border-slate-800">
            {[
              { day: 1, label: "Mon" },
              { day: 2, label: "Tue" },
              { day: 3, label: "Wed" },
              { day: 4, label: "Thu" },
              { day: 5, label: "Fri" },
              { day: 6, label: "Sat" },
            ].map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === d.day 
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Classes Timeline */}
          <div className="space-y-3">
            {todayClasses.length === 0 ? (
              <MobileEmptyState
                icon={CalendarIcon}
                title="No Classes Scheduled"
                description="No official classes scheduled for this day."
              />
            ) : (
              todayClasses.map((item) => (
                <ClassTimelineCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ACADEMICS & RESULTS HUB                                            */}
      {/* ========================================================================= */}
      {activeTab === "academics" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-display">Academics & Grades</h1>
              <p className="text-xs text-slate-400">Official Marks, Attendance & Results</p>
            </div>
          </div>

          {/* Sub-tab Segmented Control */}
          <div className="grid grid-cols-4 gap-1 bg-[#141923] p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
            {[
              { id: "attendance", label: "Attendance" },
              { id: "marks", label: "Marks" },
              { id: "exams", label: "Exams" },
              { id: "results", label: "SGPA" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setAcademicsSubTab(st.id as any)}
                className={`py-2 rounded-xl transition-all ${
                  academicsSubTab === st.id 
                    ? "bg-purple-600 text-white shadow-sm font-extrabold" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Sub-Tab 1: Official Attendance & Safe-Leave Simulator */}
          {academicsSubTab === "attendance" && (
            <div className="space-y-4">
              <AttendanceProgressRing
                percentage={overallPercentage}
                presents={overallAttended}
                totalClasses={overallTotal}
                absences={overallStats?.absent || 3}
                safeLeaves={safeLeaves}
                onViewDetails={() => setShowSafeLeaveModal(true)}
              />

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white tracking-tight">Subject-wise Official Breakdown</h3>
                <div className="space-y-2">
                  {subjectSummariesList && subjectSummariesList.length > 0 ? (
                    subjectSummariesList.map((sub) => (
                      <div key={sub.subjectId} className="p-3.5 rounded-2xl bg-[#141923] border border-slate-800 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white">{sub.subjectName}</h4>
                          <p className="text-xs text-slate-400">Attended {sub.presents} of {sub.totalClasses} classes</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-bold ${sub.percentage >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                            {Math.round(sub.percentage)}%
                          </span>
                          <span className="block text-[10px] text-slate-500">Target: 75%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    [
                      { name: "Data Structures", pct: 90, attended: 18, total: 20 },
                      { name: "Database Systems", pct: 85, attended: 17, total: 20 },
                      { name: "Operating Systems", pct: 82, attended: 14, total: 17 },
                      { name: "Computer Networks", pct: 76, attended: 13, total: 17 },
                    ].map((sub, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-[#141923] border border-slate-800 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white">{sub.name}</h4>
                          <p className="text-xs text-slate-400">Attended {sub.attended} of {sub.total} classes</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-bold ${sub.pct >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                            {sub.pct}%
                          </span>
                          <span className="block text-[10px] text-slate-500">Target: 75%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Internal Marks */}
          {academicsSubTab === "marks" && (
            <div className="space-y-3">
              {[
                { subject: "Data Structures", mid1: "24/25", mid2: "23/25", lab: "48/50" },
                { subject: "Database Systems", mid1: "22/25", mid2: "21/25", lab: "45/50" },
                { subject: "Operating Systems", mid1: "20/25", mid2: "22/25", lab: "44/50" },
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-2">
                  <h4 className="font-bold text-sm text-white">{m.subject}</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-2 rounded-xl bg-slate-900/80">
                      <span className="block text-[10px] text-slate-400">Mid-Term 1</span>
                      <span className="block font-bold text-purple-400 mt-0.5">{m.mid1}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80">
                      <span className="block text-[10px] text-slate-400">Mid-Term 2</span>
                      <span className="block font-bold text-purple-400 mt-0.5">{m.mid2}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/80">
                      <span className="block text-[10px] text-slate-400">Lab Evaluation</span>
                      <span className="block font-bold text-emerald-400 mt-0.5">{m.lab}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 3: Exam Schedule */}
          {academicsSubTab === "exams" && (
            <div className="space-y-3">
              {exams && exams.length > 0 ? (
                exams.map((ex) => (
                  <div key={ex.id} className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">End Semester Examination</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                        {ex.preparation_status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Date: {ex.exam_date} {ex.exam_time ? `@ ${ex.exam_time}` : ""}</p>
                    <p className="text-xs text-purple-300 font-medium">Venue / Hall: {ex.venue || "Main Examination Hall"}</p>
                  </div>
                ))
              ) : (
                <MobileEmptyState
                  icon={GraduationCap}
                  title="No Upcoming Exams"
                  description="No official end-semester examination schedule published yet."
                />
              )}
            </div>
          )}

          {/* Sub-Tab 4: SGPA / CGPA Results */}
          {academicsSubTab === "results" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-[#141923] to-[#111622] border border-purple-500/30 text-center space-y-1">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Cumulative Grade Point Average</span>
                <h2 className="text-4xl font-extrabold text-white font-mono">8.84 CGPA</h2>
                <p className="text-xs text-emerald-400 font-medium">Top 5% of CSE Department Batch</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-[#141923] border border-slate-800">
                  <span className="block text-[10px] text-slate-400">Sem 1 SGPA</span>
                  <span className="block text-sm font-bold text-white mt-0.5">8.60</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#141923] border border-slate-800">
                  <span className="block text-[10px] text-slate-400">Sem 2 SGPA</span>
                  <span className="block text-sm font-bold text-white mt-0.5">8.92</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#141923] border border-purple-500/30 bg-purple-500/10">
                  <span className="block text-[10px] text-purple-300">Sem 3 Est.</span>
                  <span className="block text-sm font-bold text-purple-400 mt-0.5">9.00</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PROFILE & SETTINGS                                                 */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-[#141923] border border-slate-800 text-center space-y-2">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
              <div className="h-16 w-16 rounded-full bg-[#0B0F17] flex items-center justify-center text-xl font-bold text-white">
                {profile?.full_name?.[0] || "S"}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">{profile?.full_name || "Sudhakar Patil"}</h2>
              <p className="text-xs text-slate-400">{profile?.college_name || "SFIT Mumbai"} • Roll: {profile?.roll_number || "CSE-2024-042"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 px-1">Notification Preferences</h3>
            <div className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-3 text-xs text-slate-200">
              {[
                { key: "classReminders", label: "Class & Timetable Reminders" },
                { key: "assignmentReminders", label: "Assignment Due Alerts" },
                { key: "announcementAlerts", label: "Faculty Announcements" },
                { key: "attendanceAlerts", label: "Attendance Threshold Warnings" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <Switch
                    checked={(notifPrefs as any)[item.key]}
                    onCheckedChange={(checked) => setNotifPrefs({ ...notifPrefs, [item.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NOTIFICATIONS FEED TAB                                                    */}
      {/* ========================================================================= */}
      {activeTab === "notifications" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white tracking-tight font-display">Notifications</h1>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => markAllRead()} className="text-xs text-purple-400">
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {notifications && notifications.length > 0 ? (
              notifications.map((n) => (
                <NotificationCard key={n.id} notification={n} />
              ))
            ) : (
              <MobileEmptyState
                icon={Bell}
                title="No Notifications"
                description="You're all caught up with official academic alerts."
              />
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}
