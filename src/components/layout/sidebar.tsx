"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronsLeft, NotebookPen } from "lucide-react";
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
    <div className="flex h-full flex-col border-r border-border/80 bg-surface/90 backdrop-blur-xl">
      <div className={cn("flex h-16 items-center gap-3 px-5 border-b border-border/60", collapsed && "justify-center px-0")}>
        <Link href="/dashboard" className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight" onClick={onNavigate}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-soft">
            <NotebookPen className="h-4 w-4" />
          </span>
          {!collapsed && <span className="font-display font-bold text-foreground tracking-tight text-lg">{APP_NAME}</span>}
        </Link>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as never}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-lg bg-accent/15 border-l-2 border-accent"
                  transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon className={cn("relative z-10 h-4 w-4 shrink-0 transition-colors", isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground")} />
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

      <div className="border-t border-border/60 p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse Menu</span>}
        </button>
      </div>
    </div>
  );
}
