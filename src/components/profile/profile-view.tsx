"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Hash,
  Users,
  Settings,
  Pencil,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types/database.types";

interface ProfileViewProps {
  profile: Profile | null;
  email?: string;
}

const INFO_ITEMS = [
  { key: "college_name", label: "College", icon: Building2 },
  { key: "university", label: "University", icon: GraduationCap },
  { key: "department", label: "Department", icon: BookOpen },
  { key: "branch", label: "Branch", icon: BookOpen },
  { key: "semester", label: "Semester", icon: Calendar },
  { key: "academic_year", label: "Academic Year", icon: Calendar },
  { key: "roll_number", label: "Roll Number", icon: Hash },
  { key: "batch", label: "Batch", icon: Users },
] as const;

export function ProfileView({ profile, email }: ProfileViewProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Profile"
        description="Your academic information"
        actions={
          <Link href="/settings/profile">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </Link>
        }
      />

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-shelf overflow-hidden">
          {/* Gradient header */}
          <div className="relative h-28 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Avatar + Name */}
          <div className="relative px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-indigo-600 text-xl font-semibold text-white">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="mb-1.5 min-w-0 flex-1">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                  {profile?.full_name ?? "Student"}
                </h2>
                {email && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Academic Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="glass-shelf p-6">
          <h3 className="margin-tab mb-4 font-display text-sm font-semibold text-foreground">
            Academic Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {INFO_ITEMS.map(({ key, label, icon: Icon }) => {
              const value = profile?.[key as keyof Profile];
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 transition-all hover:border-border/80"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {label}
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {value ? String(value) : "Not set"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
