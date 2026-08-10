import { create } from "zustand";
import { AnnouncementItem } from "../types";

interface AnnouncementsState {
  announcements: AnnouncementItem[];
  selectedAnnouncement: AnnouncementItem | null;
  addAnnouncement: (item: AnnouncementItem) => void;
  selectAnnouncement: (item: AnnouncementItem | null) => void;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Mid-Term Examination Schedule & Syllabus Revision Notice",
    author: "Prof. Sudhakar Patil",
    targetClass: "CSE-A • 5th Semester",
    time: "10 mins ago",
    publishedAt: new Date().toISOString(),
    isUrgent: true,
    content:
      "Dear Students,\n\nThe mid-term examination for Data Structures (CS301) and Database Systems (CS302) has been rescheduled to next Monday, August 17, 2026. Please ensure all assignment submissions for Modules 1–3 are finalized in the portal before 11:59 PM this Sunday.\n\nOffice hours for revision queries will be held on Friday between 2:00 PM – 4:00 PM in Room 402.\n\nBest regards,\nProf. Sudhakar Patil",
  },
  {
    id: "ann-2",
    title: "Lab Assignment 3 Submission Deadline Extended to Sunday",
    author: "Dr. Ananya Sharma",
    targetClass: "CSE-B • 5th Semester",
    time: "2 hours ago",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    isUrgent: false,
    content:
      "Hello CSE-B Students,\n\nBased on request, the deadline for Database Systems (CS302) Lab Assignment 3 has been extended to Sunday night. Make sure to attach your SQL query scripts and execution log screenshots.\n\nThank you,\nDr. Ananya Sharma",
  },
];

export const useAnnouncementsStore = create<AnnouncementsState>((set) => ({
  announcements: INITIAL_ANNOUNCEMENTS,
  selectedAnnouncement: null,
  addAnnouncement: (item) =>
    set((state) => ({ announcements: [item, ...state.announcements] })),
  selectAnnouncement: (selectedAnnouncement) => set({ selectedAnnouncement }),
}));
