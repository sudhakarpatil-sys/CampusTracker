"use client";

import * as React from "react";
import { Building2, Layers, GraduationCap, Globe, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import { DEPARTMENTS, SEMESTERS } from "@/lib/constants";

export function InstitutionConfigContent() {
  const { data: instData } = useSupabaseCollection<any>({ table: "institutions" });
  const inst = instData?.[0] || {
    name: "CampusTracker Demo University",
    code: "CTU-DEMO",
    domain: "campustracker.edu",
    primary_color: "#5B7FFF",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Institution Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Multi-tenant educational institution structure, department codes, and academic programs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="glass-shelf lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" /> Institution Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">Institution Name</label>
              <Input value={inst.name} readOnly className="h-8 text-xs font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">Institution Code</label>
              <Input value={inst.code} readOnly className="h-8 text-xs font-mono font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">Official Domain</label>
              <Input value={inst.domain || "campustracker.edu"} readOnly className="h-8 text-xs font-mono" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/50 p-2.5 bg-muted/20">
              <span>Multi-Tenant SaaS Status:</span>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                Active Tenant
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Departments & Classes */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" /> Academic Departments & Semesters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Registered Departments ({DEPARTMENTS.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {DEPARTMENTS.map((dept) => (
                  <Badge key={dept} variant="outline" className="px-2.5 py-1 text-xs">
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Academic Semesters ({SEMESTERS.length})</h4>
              <div className="flex flex-wrap gap-2">
                {SEMESTERS.map((sem) => (
                  <Badge key={sem} variant="secondary" className="px-3 py-1 font-mono text-xs">
                    Semester {sem}
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
