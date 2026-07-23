"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

const LABEL_OVERRIDES: Record<string, string> = {
  profile: "Profile",
  appearance: "Appearance",
  notifications: "Notifications",
  security: "Security",
  account: "Account",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const rootItem = NAV_ITEMS.find((item) => item.href === `/${segments[0]}`);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/dashboard" className="hover:text-foreground">
        Home
      </Link>
      {segments.map((segment, i) => {
        const href = `/${segments.slice(0, i + 1).join("/")}`;
        const isLast = i === segments.length - 1;
        const label = i === 0 ? rootItem?.label ?? segment : LABEL_OVERRIDES[segment] ?? segment;
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href as never} className="hover:text-foreground capitalize">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
