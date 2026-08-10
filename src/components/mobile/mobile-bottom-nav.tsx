"use client";

import * as React from "react";
import { 
  Home, 
  Calendar, 
  GraduationCap, 
  User, 
  Plus, 
  BookOpen, 
  FileText, 
  Megaphone, 
  LayoutDashboard, 
  Database, 
  Activity, 
  ShieldCheck, 
  Bell,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type MobileTab = 
  | "home" 
  | "timetable" 
  | "academics" 
  | "notifications" 
  | "profile" 
  | "faculty_home" 
  | "faculty_subjects" 
  | "faculty_notes" 
  | "faculty_assignments" 
  | "admin_dashboard" 
  | "admin_connectors" 
  | "admin_sync" 
  | "admin_audit";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  role: "student" | "faculty" | "admin";
  onFabClick?: () => void;
  fabOpen?: boolean;
}

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  role,
  onFabClick,
  fabOpen = false,
}: MobileBottomNavProps) {
  // Navigation tab definitions per role
  const getTabs = () => {
    if (role === "faculty") {
      return [
        { id: "faculty_home" as MobileTab, label: "Home", icon: Home },
        { id: "faculty_subjects" as MobileTab, label: "Subjects", icon: BookOpen },
        { id: "timetable" as MobileTab, label: "Schedule", icon: Calendar },
        { id: "profile" as MobileTab, label: "Profile", icon: User },
      ];
    }

    if (role === "admin") {
      return [
        { id: "admin_dashboard" as MobileTab, label: "Overview", icon: LayoutDashboard },
        { id: "admin_connectors" as MobileTab, label: "Connectors", icon: Database },
        { id: "admin_sync" as MobileTab, label: "Sync", icon: Activity },
        { id: "admin_audit" as MobileTab, label: "Audit", icon: ShieldCheck },
        { id: "profile" as MobileTab, label: "Settings", icon: User },
      ];
    }

    // Default Student Tabs
    return [
      { id: "home" as MobileTab, label: "Home", icon: Home },
      { id: "timetable" as MobileTab, label: "Classes", icon: Calendar },
      { id: "academics" as MobileTab, label: "Academics", icon: GraduationCap },
      { id: "profile" as MobileTab, label: "Profile", icon: User },
    ];
  };

  const tabs = getTabs();

  return (
    <div className="w-full px-3 pb-2 pt-1 relative">
      {/* Floating Translucent Bar */}
      <div className="bg-[#141923] border border-slate-800/90 rounded-2xl shadow-2xl px-3 py-2 flex items-center justify-between relative">
        
        {/* Left Tabs */}
        <div className="flex items-center justify-around flex-1">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer select-none py-1 px-2 rounded-xl ${
                  isActive 
                    ? "text-purple-400 scale-105 font-bold" 
                    : "text-slate-400 hover:text-slate-200 font-medium"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-purple-500/20" : "bg-transparent"}`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                </div>
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Floating Action Button (FAB) for Student & Faculty */}
        {role !== "admin" && (
          <div className="relative -top-5 flex flex-col items-center z-50 px-1">
            <button
              type="button"
              onClick={onFabClick}
              className={`h-12 w-12 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-400 text-white flex items-center justify-center shadow-lg shadow-purple-500/40 ring-4 ring-[#0B0F17] transition-transform duration-300 cursor-pointer select-none active:scale-95 ${
                fabOpen ? "rotate-45 bg-rose-600 shadow-rose-500/40" : "hover:scale-105"
              }`}
              aria-label="Quick Action FAB"
            >
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Right Tabs */}
        <div className="flex items-center justify-around flex-1">
          {tabs.slice(2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer select-none py-1 px-2 rounded-xl ${
                  isActive 
                    ? "text-purple-400 scale-105 font-bold" 
                    : "text-slate-400 hover:text-slate-200 font-medium"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-purple-500/20" : "bg-transparent"}`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                </div>
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
