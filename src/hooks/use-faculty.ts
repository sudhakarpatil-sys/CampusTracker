"use client";

import * as React from "react";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import { AcademicEventBus, AcademicEventType } from "@/lib/events/event-bus";
import type { Subject } from "@/types/database.types";

export interface FacultyProfile {
  id: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  facultyId: string;
  assignedSubjects: Subject[];
}

export function useFaculty() {
  const { data: subjectsData, isLoading: isSubjectsLoading, refetch: refetchSubjects } = useSupabaseCollection<Subject>({
    table: "subjects",
    orderBy: { column: "name", ascending: true },
  });

  const facultyProfile: FacultyProfile = React.useMemo(() => {
    return {
      id: "fac_prof_01",
      fullName: "Dr. Rajesh Sharma",
      email: "r.sharma@campustracker.edu",
      department: "Computer Science & Engineering",
      designation: "Associate Professor",
      facultyId: "FAC-CSE-104",
      assignedSubjects: subjectsData || [],
    };
  }, [subjectsData]);

  function publishFacultyEvent<T = any>(
    eventType: AcademicEventType,
    payload: T,
    institutionId = "inst_demo_01"
  ) {
    return AcademicEventBus.publish(eventType, institutionId, payload, "faculty_portal");
  }

  return {
    profile: facultyProfile,
    assignedSubjects: subjectsData || [],
    isLoading: isSubjectsLoading,
    publishFacultyEvent,
    refetchSubjects,
  };
}
