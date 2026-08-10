"use client";

import * as React from "react";
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Megaphone, 
  Users, 
  Calendar, 
  Clock, 
  Award,
  Sparkles,
  User,
  Mail,
  Building,
  ShieldCheck,
  LogOut,
  Bell,
  CheckCircle2
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useNotes } from "@/hooks/use-notes";
import { useAssignments } from "@/hooks/use-assignments";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { MobileBottomNav, type MobileTab } from "@/components/mobile/mobile-bottom-nav";
import { MobileModal } from "@/components/mobile/mobile-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useAnnouncementsStore, type BroadcastAnnouncement } from "@/lib/announcements-store";

interface FacultyAppProps {
  onRoleSwitch?: (role: "student" | "faculty" | "admin" | "onboarding") => void;
}

export function FacultyApp({ onRoleSwitch }: FacultyAppProps) {
  const { user, profile: userProfile } = useUser();
  const { notes, createNote } = useNotes();
  const { assignments, createAssignment } = useAssignments();
  const { announcements, broadcastAnnouncement } = useAnnouncementsStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = React.useState<MobileTab>("faculty_home");
  const [selectedDay, setSelectedDay] = React.useState<number>(new Date().getDay() || 1);
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState<BroadcastAnnouncement | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState<"note" | "assignment" | "announcement" | null>(null);

  // Form states
  const [noteTitle, setNoteTitle] = React.useState("");
  const [noteContent, setNoteContent] = React.useState("");
  const [assignTitle, setAssignTitle] = React.useState("");
  const [assignDueDate, setAssignDueDate] = React.useState("");
  const [announceTitle, setAnnounceTitle] = React.useState("");
  const [announceMessage, setAnnounceMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handlePublishNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createNote({ title: noteTitle, content: noteContent });
      toast({ title: "Resource Published", description: "Class note is now visible to enrolled students." });
      setNoteTitle("");
      setNoteContent("");
      setShowCreateModal(null);
    } catch (err: any) {
      toast({ title: "Failed to publish note", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createAssignment({ 
        title: assignTitle, 
        dueDate: assignDueDate || new Date(Date.now() + 7 * 86400000).toISOString(), 
        priority: "medium",
        status: "in_progress"
      });
      toast({ title: "Assignment Created", description: "Course task assigned to enrolled students." });
      setAssignTitle("");
      setAssignDueDate("");
      setShowCreateModal(null);
    } catch (err: any) {
      toast({ title: "Failed to create assignment", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceTitle.trim()) return;
    setIsSubmitting(true);
    try {
      broadcastAnnouncement({
        title: announceTitle,
        message: announceMessage || announceTitle,
        subjectCode: "CS301",
        subjectName: "Data Structures & Algorithms",
        authorName: userProfile?.full_name || "Prof. Rajesh Sharma",
        priority: "high",
      });
      toast({ title: "Announcement Broadcasted!", description: "Live on student mobile feeds and notification alert dot." });
      setAnnounceTitle("");
      setAnnounceMessage("");
      setShowCreateModal(null);
    } catch (err: any) {
      toast({ title: "Broadcast failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Faculty Schedule Days
  const days = [
    { num: 1, label: "Mon" },
    { num: 2, label: "Tue" },
    { num: 3, label: "Wed" },
    { num: 4, label: "Thu" },
    { num: 5, label: "Fri" },
  ];

  // Faculty Teaching Timetable Data
  const facultySchedule = [
    { day: 1, time: "09:00 AM - 10:00 AM", subject: "Data Structures", code: "CS301", room: "Room 402", batch: "CSE-A (64 Students)", status: "Completed" },
    { day: 1, time: "11:00 AM - 12:00 PM", subject: "Database Systems", code: "CS302", room: "Room 305", batch: "CSE-B (58 Students)", status: "Ongoing" },
    { day: 1, time: "02:00 PM - 04:00 PM", subject: "Algorithms Lab", code: "CS301L", room: "Lab 302", batch: "CSE-A Batch 1", status: "Upcoming" },
    { day: 2, time: "10:00 AM - 11:00 AM", subject: "Operating Systems", code: "CS304", room: "Room 405", batch: "CSE-A (64 Students)", status: "Upcoming" },
    { day: 2, time: "01:00 PM - 02:00 PM", subject: "Database Systems", code: "CS302", room: "Room 305", batch: "CSE-B (58 Students)", status: "Upcoming" },
    { day: 3, time: "09:00 AM - 10:00 AM", subject: "Data Structures", code: "CS301", room: "Room 402", batch: "CSE-A (64 Students)", status: "Upcoming" },
    { day: 3, time: "11:00 AM - 01:00 PM", subject: "DBMS Lab", code: "CS302L", room: "Lab 201", batch: "CSE-B Batch 2", status: "Upcoming" },
    { day: 4, time: "10:00 AM - 11:00 AM", subject: "Operating Systems", code: "CS304", room: "Room 405", batch: "CSE-A (64 Students)", status: "Upcoming" },
    { day: 5, time: "09:00 AM - 10:00 AM", subject: "Data Structures", code: "CS301", room: "Room 402", batch: "CSE-A (64 Students)", status: "Upcoming" },
    { day: 5, time: "02:00 PM - 03:00 PM", subject: "Faculty Meeting", code: "DEPT", room: "Conf Room A", batch: "Department Staff", status: "Upcoming" },
  ];

  const currentDayClasses = facultySchedule.filter(c => c.day === selectedDay);

  return (
    <MobileShell 
      activeRole="faculty" 
      onRoleSwitch={onRoleSwitch}
      bottomNav={
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          role="faculty"
          onFabClick={() => setShowCreateModal("announcement")}
        />
      }
      modals={
        <>
          <MobileModal
            isOpen={showCreateModal === "note"}
            onClose={() => setShowCreateModal(null)}
            title="Publish Class Note / Resource"
          >
            <form onSubmit={handlePublishNote} className="space-y-3">
              <Input
                placeholder="Note Title (e.g. Linked List Notes)"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
                required
              />
              <Textarea
                placeholder="Note content / resource summary..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white min-h-[100px]"
                required
              />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-500 font-bold h-10">
                Publish Resource
              </Button>
            </form>
          </MobileModal>

          <MobileModal
            isOpen={showCreateModal === "assignment"}
            onClose={() => setShowCreateModal(null)}
            title="Create Class Assignment"
          >
            <form onSubmit={handlePublishAssignment} className="space-y-3">
              <Input
                placeholder="Assignment Title (e.g. DBMS Mini Project)"
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
                required
              />
              <Input
                type="date"
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
              />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-500 font-bold h-10 text-white">
                Create Assignment
              </Button>
            </form>
          </MobileModal>

          <MobileModal
            isOpen={showCreateModal === "announcement"}
            onClose={() => setShowCreateModal(null)}
            title="Broadcast Class Announcement"
          >
            <form onSubmit={handlePublishAnnouncement} className="space-y-3">
              <Input
                placeholder="Announcement Title"
                value={announceTitle}
                onChange={(e) => setAnnounceTitle(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white"
                required
              />
              <Textarea
                placeholder="Broadcast message..."
                value={announceMessage}
                onChange={(e) => setAnnounceMessage(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white min-h-[90px]"
                required
              />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 font-bold h-10 text-white">
                Broadcast Announcement
              </Button>
            </form>
          </MobileModal>

          {/* Announcement Reader Drawer */}
          <MobileModal
            isOpen={!!selectedAnnouncement}
            onClose={() => setSelectedAnnouncement(null)}
            title="Broadcasted Announcement Details"
          >
            {selectedAnnouncement && (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/20">
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
                  <p className="text-[11px] text-blue-400 font-medium">
                    Published Broadcast ({selectedAnnouncement.subjectName})
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 leading-relaxed text-slate-200 text-xs break-all break-words whitespace-pre-wrap">
                  {selectedAnnouncement.message}
                </div>

                <Button 
                  type="button" 
                  onClick={() => setSelectedAnnouncement(null)} 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 rounded-xl cursor-pointer"
                >
                  Close Reader
                </Button>
              </div>
            )}
          </MobileModal>
        </>
      }
    >
      {/* ========================================================================= */}
      {/* TAB 1: FACULTY HOME DASHBOARD                                             */}
      {/* ========================================================================= */}
      {activeTab === "faculty_home" && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-white tracking-tight font-display">Faculty Dashboard</h1>
            <p className="text-xs text-slate-400">Welcome, {userProfile?.full_name || "Prof. Rajesh Sharma"}. Academic Management Hub.</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-[#141923] border border-slate-800 space-y-1">
              <span className="block text-[10px] text-slate-400 font-medium uppercase">Active Classes</span>
              <span className="block text-xl font-bold text-purple-400">4 Classes</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141923] border border-slate-800 space-y-1">
              <span className="block text-[10px] text-slate-400 font-medium uppercase">Notes Shared</span>
              <span className="block text-xl font-bold text-blue-400">{notes.length || 12} Files</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141923] border border-slate-800 space-y-1">
              <span className="block text-[10px] text-slate-400 font-medium uppercase">Assignments</span>
              <span className="block text-xl font-bold text-amber-400">{assignments.length || 3} Active</span>
            </div>
          </div>

          {/* Quick Action Publisher Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal("note")}
              className="p-3 rounded-2xl bg-[#141923] border border-slate-800 hover:border-purple-500/40 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200">Share Note</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCreateModal("assignment")}
              className="p-3 rounded-2xl bg-[#141923] border border-slate-800 hover:border-amber-500/40 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200">Create Task</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCreateModal("announcement")}
              className="p-3 rounded-2xl bg-[#141923] border border-slate-800 hover:border-blue-500/40 flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400">
                <Megaphone className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-200">Broadcast</span>
            </button>
          </div>

          {/* Today's Teaching Slots */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-purple-400" /> Today&apos;s Teaching Schedule
            </h3>
            {currentDayClasses.slice(0, 3).map((c, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#141923] border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-400 font-semibold">{c.time}</span>
                  <h4 className="font-bold text-sm text-white">{c.subject} ({c.code})</h4>
                  <span className="text-xs text-slate-400">{c.room} • {c.batch}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  c.status === "Ongoing" 
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse"
                    : c.status === "Completed"
                    ? "bg-slate-800 text-slate-400 border-slate-700"
                    : "bg-blue-500/15 text-blue-400 border-blue-500/20"
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>

          {/* Recent Broadcasts Feed */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Megaphone className="h-4 w-4 text-blue-400" /> Broadcasted Announcements ({announcements.length})
            </h3>
            <div className="space-y-2.5">
              {announcements.map((a) => (
                <div 
                  key={a.id} 
                  onClick={() => setSelectedAnnouncement(a)}
                  className="p-3.5 rounded-2xl bg-[#141923] border border-blue-500/20 hover:border-blue-500/50 space-y-1.5 relative cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/20">
                      {a.subjectCode}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white leading-snug break-words">{a.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 break-all break-words">{a.message}</p>
                  <span className="block text-[10px] text-blue-400 font-semibold pt-1">Tap to read full broadcast &rarr;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FACULTY SUBJECTS & CLASSES                                         */}
      {/* ========================================================================= */}
      {activeTab === "faculty_subjects" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight font-display">Assigned Subjects</h1>
            <p className="text-xs text-slate-400">Course rosters, enrolled students & classroom allocation.</p>
          </div>

          <div className="space-y-3">
            {[
              { name: "Data Structures & Algorithms", code: "CS301", students: 64, room: "Room 402", batch: "CSE Semester 3" },
              { name: "Database Management Systems", code: "CS302", students: 58, room: "Room 305", batch: "CSE Semester 3" },
              { name: "Algorithms Laboratory", code: "CS301L", students: 32, room: "Lab 302", batch: "CSE Semester 3 (Batch A)" },
              { name: "DBMS Laboratory", code: "CS302L", students: 29, room: "Lab 201", batch: "CSE Semester 3 (Batch B)" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{s.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/20 font-bold">{s.code}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Classroom: <strong className="text-slate-200">{s.room}</strong></span>
                  <span className="flex items-center gap-1 text-purple-300 font-medium">
                    <Users className="h-3.5 w-3.5" /> {s.students} Enrolled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FACULTY TEACHING SCHEDULE                                          */}
      {/* ========================================================================= */}
      {activeTab === "timetable" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight font-display">Teaching Schedule</h1>
            <p className="text-xs text-slate-400">Weekly lecture slots, lab sessions & office hours.</p>
          </div>

          {/* Day Ribbon Selector */}
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
            {days.map((d) => (
              <button
                type="button"
                key={d.num}
                onClick={() => setSelectedDay(d.num)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDay === d.num 
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/30" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Schedule Slot Cards */}
          <div className="space-y-3 pt-1">
            {currentDayClasses.length > 0 ? (
              currentDayClasses.map((slot, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#141923] border border-slate-800/80 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {slot.time}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      slot.status === "Ongoing" 
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse"
                        : slot.status === "Completed"
                        ? "bg-slate-800 text-slate-400 border-slate-700"
                        : "bg-blue-500/15 text-blue-400 border-blue-500/20"
                    }`}>
                      {slot.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white tracking-tight">{slot.subject} ({slot.code})</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                    <span>Venue: <strong className="text-slate-200">{slot.room}</strong></span>
                    <span className="text-slate-300 font-medium">{slot.batch}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-[#141923] rounded-2xl border border-slate-800 space-y-2">
                <Calendar className="h-8 w-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No lectures scheduled</p>
                <p className="text-xs text-slate-500">You have no teaching slots on this day.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FACULTY PROFILE & ACADEMIC INFO                                    */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 via-[#141923] to-[#111622] border border-purple-500/30 text-center space-y-3 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-xl ring-4 ring-purple-500/20">
              {userProfile?.full_name?.split(" ").map(n => n[0]).join("") || "RS"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{userProfile?.full_name || "Prof. Rajesh Sharma"}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-1">
                <Award className="h-3.5 w-3.5 text-purple-400" /> Associate Professor • CSE
              </span>
            </div>
          </div>

          {/* Academic Profile Details */}
          <div className="p-4 rounded-2xl bg-[#141923] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Faculty Identification</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-400" /> Faculty ID
                </span>
                <span className="font-mono font-bold text-white">FAC-2024-884</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-400" /> Department
                </span>
                <span className="font-semibold text-white">Computer Science & Eng.</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-400" /> Official Email
                </span>
                <span className="font-mono text-purple-300">{user?.email || "r.sharma@campustracker.edu"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" /> Office Hours
                </span>
                <span className="font-semibold text-slate-200">03:00 PM - 05:00 PM (Tue/Thu)</span>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <Button
            type="button"
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold h-11 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign Out of Faculty Portal
          </Button>
        </div>
      )}
    </MobileShell>
  );
}
