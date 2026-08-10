"use client";

import * as React from "react";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  GraduationCap, 
  FileText, 
  Megaphone,
  ShieldCheck
} from "lucide-react";
import type { AppNotification } from "@/types/database.types";

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  className?: string;
}

export function NotificationCard({
  notification,
  onMarkRead,
  className = "",
}: NotificationCardProps) {
  const getTypeBadge = () => {
    switch (notification.type) {
      case "success":
        return {
          icon: CheckCircle2,
          color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-amber-400 bg-amber-500/15 border-amber-500/20",
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-rose-400 bg-rose-500/15 border-rose-500/20",
        };
      default:
        return {
          icon: Info,
          color: "text-purple-400 bg-purple-500/15 border-purple-500/20",
        };
    }
  };

  const badge = getTypeBadge();
  const Icon = badge.icon;

  return (
    <div
      onClick={() => onMarkRead?.(notification.id)}
      className={`relative bg-gradient-to-br from-[#181F2E] to-[#141923] border border-slate-800/80 rounded-2xl p-4 shadow-md transition-all hover:border-purple-500/40 cursor-pointer overflow-hidden ${
        !notification.read ? "border-l-4 border-l-purple-500" : "opacity-80"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl border shrink-0 ${badge.color}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`font-bold text-sm tracking-tight line-clamp-1 ${!notification.read ? "text-white" : "text-slate-300"}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] text-slate-500 font-medium shrink-0">
              {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
