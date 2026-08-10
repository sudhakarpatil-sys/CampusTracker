"use client";

import * as React from "react";
import { useUser } from "@/hooks/use-user";
import { StudentApp } from "@/components/mobile/student/student-app";
import { FacultyApp } from "@/components/mobile/faculty/faculty-app";
import { AdminApp } from "@/components/mobile/admin/admin-app";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { FirstTimeStudentOnboarding } from "@/components/mobile/student/student-onboarding";
import { MobileAuthScreen } from "@/components/mobile/auth/mobile-auth-screen";

export type RolePreview = "login" | "onboarding" | "student" | "faculty" | "admin";

export default function MobileMainPage() {
  const { profile } = useUser();
  const [overrideRole, setOverrideRole] = React.useState<RolePreview | null>(null);

  // Determine current effective role
  const effectiveRole: RolePreview = overrideRole || (profile?.role as RolePreview) || "student";

  if (effectiveRole === "login") {
    return (
      <MobileShell activeRole="student" onRoleSwitch={setOverrideRole}>
        <MobileAuthScreen onSuccessLogin={(r) => setOverrideRole(r)} />
      </MobileShell>
    );
  }

  if (effectiveRole === "onboarding") {
    return (
      <MobileShell activeRole="student" onRoleSwitch={setOverrideRole}>
        <FirstTimeStudentOnboarding onComplete={() => setOverrideRole("student")} />
      </MobileShell>
    );
  }

  if (effectiveRole === "faculty") {
    return <FacultyApp onRoleSwitch={setOverrideRole} />;
  }

  if (effectiveRole === "admin") {
    return <AdminApp onRoleSwitch={setOverrideRole} />;
  }

  // Default Student Role
  return <StudentApp onRoleSwitch={setOverrideRole} />;
}
