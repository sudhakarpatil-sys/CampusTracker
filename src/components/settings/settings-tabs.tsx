"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Bell, ShieldCheck, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Appearance", href: "/settings/appearance", icon: Palette },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Security", href: "/settings/security", icon: KeyRound },
  { label: "Account", href: "/settings/account", icon: ShieldCheck },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-border/60 pb-px">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href as never}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
