"use client";

import * as React from "react";
import { User, Mail, Building2, BadgeCheck, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useFaculty } from "@/hooks/use-faculty";

export function FacultyProfileViewContent() {
  const { profile } = useFaculty();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Faculty Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Institutional faculty profile, department designation, and teaching credentials.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="glass-shelf lg:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-2xl shadow-inner border border-violet-500/30">
              {profile.fullName.split(" ").map((n) => n[0]).join("")}
            </div>
            <CardTitle className="text-lg font-bold mt-3">{profile.fullName}</CardTitle>
            <p className="text-xs text-muted-foreground">{profile.designation}</p>
          </CardHeader>
          <CardContent className="space-y-3 text-xs pt-2">
            <div className="flex items-center justify-between rounded-xl border border-border/50 p-2.5 bg-muted/20">
              <span className="text-muted-foreground">Staff ID:</span>
              <span className="font-mono font-semibold text-foreground">{profile.facultyId}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/50 p-2.5 bg-muted/20">
              <span className="text-muted-foreground">Verification:</span>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] gap-1">
                <BadgeCheck className="h-3 w-3" /> Verified Faculty
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Institutional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">Department</label>
              <Input value={profile.department} readOnly className="h-9 text-xs font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">Official Academic Email</label>
              <Input value={profile.email} readOnly className="h-9 text-xs font-mono font-semibold" />
            </div>

            <div>
              <label className="font-medium text-muted-foreground mb-2 block">Teaching Allocation ({profile.assignedSubjects.length} subjects)</label>
              <div className="flex flex-wrap gap-2">
                {profile.assignedSubjects.map((s) => (
                  <Badge key={s.id} variant="outline" className="px-3 py-1 text-xs">
                    {s.name} ({s.code || "CS"})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
