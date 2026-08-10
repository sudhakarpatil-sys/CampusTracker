"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  Link2,
  Database,
  Activity,
  HeartPulse,
  RotateCcw,
  AlertOctagon,
  ShieldCheck,
  Building2,
  Settings,
  ChevronsLeft,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Connectors", href: "/admin/connectors", icon: Link2 },
  { label: "Datasets", href: "/admin/datasets", icon: Database },
  { label: "Sync Activity", href: "/admin/sync-activity", icon: Activity },
  { label: "Connector Health", href: "/admin/health", icon: HeartPulse },
  { label: "Retry Queue", href: "/admin/retry-queue", icon: RotateCcw },
  { label: "Emergency Import", href: "/admin/emergency-import", icon: AlertOctagon, badge: "Recovery" },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
  { label: "Institution", href: "/admin/institution", icon: Building2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed, onToggle, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex h-full flex-col border-r border-border/70 bg-card/70 backdrop-blur-xl">
      {/* Brand Header with Admin Console Badge */}
      <div className={cn("flex h-16 items-center gap-3 px-5 border-b border-border/50", collapsed && "justify-center px-0")}>
        <Link href={"/admin/dashboard" as any} onClick={onNavigate} className="flex items-center gap-2">
          <Logo iconOnly={collapsed} size="sm" />
          {!collapsed && (
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">
              Admin
            </Badge>
          )}
        </Link>
      </div>

      {/* Nav Menu Items */}
      <nav aria-label="Admin menu" className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-3" data-testid="admin-sidebar-nav">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href as any}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200",
                isActive ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-indigo-500/10 border border-indigo-500/30"
                  transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon className={cn("relative z-10 h-4 w-4 shrink-0 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && (
                <span className="relative z-10 flex flex-1 items-center justify-between">
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-[9px] font-mono tracking-wider bg-rose-500/10 text-rose-500 border-rose-500/20">
                      {item.badge}
                    </Badge>
                  )}
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
          data-testid="admin-sidebar-toggle"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse Menu</span>}
        </button>
      </div>
    </div>
  );
}
