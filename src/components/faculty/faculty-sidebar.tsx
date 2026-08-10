"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Megaphone,
  FolderKanban,
  Calendar,
  Activity,
  User,
  Settings,
  ChevronsLeft,
  GraduationCap,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const FACULTY_NAV_ITEMS = [
  { label: "Overview", href: "/faculty/dashboard", icon: LayoutDashboard },
  { label: "My Subjects", href: "/faculty/subjects", icon: BookOpen },
  { label: "Notes", href: "/faculty/notes", icon: FileText },
  { label: "Assignments", href: "/faculty/assignments", icon: FileSpreadsheet },
  { label: "Internal Marks", href: "/faculty/marks", icon: GraduationCap },
  { label: "Announcements", href: "/faculty/announcements", icon: Megaphone },
  { label: "Resources", href: "/faculty/resources", icon: FolderKanban },
  { label: "Timetable", href: "/faculty/timetable", icon: Calendar },
  { label: "Activity", href: "/faculty/activity", icon: Activity },
  { label: "Profile", href: "/faculty/profile", icon: User },
  { label: "Settings", href: "/faculty/settings", icon: Settings },
];

interface FacultySidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function FacultySidebar({ collapsed, onToggle, onNavigate }: FacultySidebarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex h-full flex-col border-r border-border/70 bg-card/70 backdrop-blur-xl">
      {/* Brand Header with Faculty Console Badge */}
      <div className={cn("flex h-16 items-center gap-3 px-5 border-b border-border/50", collapsed && "justify-center px-0")}>
        <Link href={"/faculty/dashboard" as any} onClick={onNavigate} className="flex items-center gap-2">
          <Logo iconOnly={collapsed} size="sm" />
          {!collapsed && (
            <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-[9px] font-semibold text-violet-600 dark:text-violet-400">
              Faculty
            </Badge>
          )}
        </Link>
      </div>

      {/* Nav Menu Items */}
      <nav aria-label="Faculty menu" className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-3" data-testid="faculty-sidebar-nav">
        {FACULTY_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/faculty/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href as any}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200",
                isActive ? "text-violet-600 dark:text-violet-400 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="faculty-sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-violet-500/10 border border-violet-500/30"
                  transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon className={cn("relative z-10 h-4 w-4 shrink-0 transition-colors", isActive ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && (
                <span className="relative z-10 flex flex-1 items-center justify-between">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Switch to Student Portal & Toggle */}
      <div className="space-y-2 border-t border-border/50 p-3">
        {!collapsed && (
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 transition-all duration-200"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student Portal</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          data-testid="faculty-sidebar-toggle"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse Menu</span>}
        </button>
      </div>
    </div>
  );
}
