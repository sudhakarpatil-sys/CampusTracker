"use client";

import * as React from "react";

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  message: string;
  subjectCode: string;
  subjectName: string;
  authorName: string;
  createdAt: string;
  priority?: "high" | "normal";
}

const INITIAL_ANNOUNCEMENTS: BroadcastAnnouncement[] = [
  {
    id: "ann-1",
    title: "Midterm Exam Schedule & Syllabus Announced",
    message: "Data Structures (CS301) Midterm Exam will take place next Wednesday in Hall 402. Syllabus covers Modules 1 through 3.",
    subjectCode: "CS301",
    subjectName: "Data Structures & Algorithms",
    authorName: "Prof. Rajesh Sharma",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    priority: "high",
  },
  {
    id: "ann-2",
    title: "DBMS Project Submission Extension",
    message: "Deadline for DBMS Relational Schema submission has been extended by 48 hours to Friday, 11:59 PM.",
    subjectCode: "CS302",
    subjectName: "Database Management Systems",
    authorName: "Prof. Rajesh Sharma",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    priority: "normal",
  },
  {
    id: "ann-3",
    title: "Algorithms Lab Extra Practice Session",
    message: "An optional lab revision session for Trees and Graphs will be conducted tomorrow from 03:00 PM to 05:00 PM in Lab 302.",
    subjectCode: "CS301L",
    subjectName: "Algorithms Laboratory",
    authorName: "Prof. Rajesh Sharma",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    priority: "normal",
  },
];

// Global in-memory reactive store for announcements
let globalAnnouncements = [...INITIAL_ANNOUNCEMENTS];
const listeners = new Set<() => void>();

export function useAnnouncementsStore() {
  const [announcements, setAnnouncements] = React.useState<BroadcastAnnouncement[]>(globalAnnouncements);

  React.useEffect(() => {
    const onChange = () => setAnnouncements([...globalAnnouncements]);
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  const broadcastAnnouncement = React.useCallback((announcement: Omit<BroadcastAnnouncement, "id" | "createdAt">) => {
    const newAnn: BroadcastAnnouncement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    globalAnnouncements = [newAnn, ...globalAnnouncements];
    listeners.forEach((listener) => listener());
    return newAnn;
  }, []);

  return {
    announcements,
    broadcastAnnouncement,
  };
}
