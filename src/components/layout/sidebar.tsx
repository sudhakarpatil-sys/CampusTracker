"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronsLeft, GraduationCap } from "lucide-react";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex h-full flex-col border-r border-border/70 bg-card/60 backdrop-blur-xl">
      {/* Brand Header */}
      <div className={cn("flex h-16 items-center gap-3 px-5 border-b border-border/50", collapsed && "justify-center px-0")}>
        <Link href="/dashboard" className="flex items-center gap-3 font-display font-bold tracking-tight" onClick={onNavigate}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="font-display font-extrabold text-foreground tracking-tight text-lg bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
              {APP_NAME}
            </span>
          )}
        </Link>
      </div>

      {/* Nav Menu Items */}
      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as never}
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
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-indigo-500/10 border border-indigo-500/30"
                  transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon className={cn("relative z-10 h-4 w-4 shrink-0 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && (
                <span className="relative z-10 flex flex-1 items-center justify-between">
                  {item.label}
                  {item.comingSoon && (
                    <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-[9px] font-mono tracking-wider">
                      Soon
                    </Badge>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Collapse Toggle */}
      <div className="border-t border-border/50 p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-200"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse Menu</span>}
        </button>
      </div>
    </div>
  );
}
