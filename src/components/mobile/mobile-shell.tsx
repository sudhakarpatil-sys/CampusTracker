"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  Search, 
  ChevronLeft, 
  Moon, 
  Sun, 
  LogOut, 
  ShieldAlert, 
  CheckCircle2, 
  GraduationCap,
  Sparkles
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MobileShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  unreadCount?: number;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  activeRole?: "student" | "faculty" | "admin";
  onRoleSwitch?: (role: "student" | "faculty" | "admin" | "onboarding") => void;
  bottomNav?: React.ReactNode;
  modals?: React.ReactNode;
}

export function MobileShell({
  children,
  title,
  showBack = false,
  onBack,
  unreadCount = 0,
  onOpenSearch,
  onOpenNotifications,
  activeRole,
  onRoleSwitch,
  bottomNav,
  modals,
}: MobileShellProps) {
  const { user, profile } = useUser();
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "CT";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const userRole = activeRole || (profile?.role as "student" | "faculty" | "admin") || "student";

  return (
    <div className={`w-full min-h-screen ${theme === "dark" ? "bg-[#07090E] text-slate-100" : "bg-slate-100 text-slate-900"} flex items-center justify-center p-0 sm:p-4 selection:bg-purple-500 selection:text-white`}>
      
      {/* Mobile Device Container Frame */}
      <div className={`w-full max-w-md h-screen sm:h-[844px] sm:max-h-[90vh] sm:rounded-[36px] sm:border-[6px] ${theme === "dark" ? "bg-[#0B0F17] border-slate-800/80 shadow-purple-500/10" : "bg-white border-slate-300 shadow-slate-400/20"} flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-200`}>
        
        {/* Mobile Top App Bar Header */}
        <header className={`shrink-0 z-30 px-4 py-3 backdrop-blur-xl ${theme === "dark" ? "bg-[#0B0F17]/90 border-b border-slate-800/60" : "bg-white/90 border-b border-slate-100"} flex items-center justify-between transition-colors`}>
          {showBack ? (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-9 w-9 rounded-full hover:bg-purple-500/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {title && <h1 className="font-semibold text-lg tracking-tight text-white">{title}</h1>}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-purple-500/40 ring-offset-2 ring-offset-[#0B0F17] transition-all">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User Avatar"} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-bold text-xs">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-purple-400/90 tracking-wide uppercase">
                    {userRole === "student" ? "Student" : userRole === "faculty" ? "Faculty" : "Administrator"}
                  </span>
                  {userRole === "student" && profile?.semester && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                      Sem {profile.semester}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-xs tracking-tight text-white line-clamp-1">
                  {profile?.full_name || user?.email?.split("@")[0] || "Campus Student"}
                </h2>
              </div>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-1">
            {onOpenSearch && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onOpenSearch}
                className="h-8 w-8 rounded-full hover:bg-purple-500/10 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            {onOpenNotifications && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onOpenNotifications}
                className="h-8 w-8 rounded-full hover:bg-purple-500/10 text-slate-400 hover:text-purple-300 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-[#0B0F17] animate-pulse" />
                )}
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full hover:bg-purple-500/10 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </Button>
          </div>
        </header>

        {/* Role Switcher Banner */}
        {onRoleSwitch && (
          <div className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-purple-950/90 via-slate-900 to-purple-950/90 border-b border-purple-500/30 flex items-center justify-between text-xs text-purple-300 z-30">
            <span className="flex items-center gap-1 font-medium text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Role:
            </span>
            <div className="flex gap-1">
              {(["onboarding", "student", "faculty", "admin"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoleSwitch(r);
                  }}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase transition-all cursor-pointer ${
                    (userRole === r || (userRole === "student" && r === "onboarding" && activeRole === undefined))
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/40" 
                      : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {r === "onboarding" ? "NEW USER" : r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-24 scrollbar-thin scrollbar-thumb-slate-800 relative z-10">
          {children}
        </main>

        {/* Floating Bottom Navigation Bar (z-30) */}
        {bottomNav && (
          <div className="absolute bottom-3 left-3 right-3 z-30">
            {bottomNav}
          </div>
        )}

        {/* Modals Slot (z-50 - Higher stacking context than bottomNav z-30!) */}
        {modals}
      </div>
    </div>
  );
}
