import * as React from "react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 font-display font-extrabold tracking-tight", className)}>
      {/* Bespoke Geometric Logo Mark */}
      <div className={cn("relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 p-2 text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 hover:scale-105", iconSizes[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Graduation Cap Diamond + Orbital Ring Monogram Path */}
          <path
            d="M12 3L2 8L12 13L22 8L12 3Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          <path
            d="M6 10.5V15.5C6 17.5 8.686 19.5 12 19.5C15.314 19.5 18 17.5 18 15.5V10.5L12 13.5L6 10.5Z"
            fill="currentColor"
            fillOpacity="0.75"
          />
          <circle cx="19.5" cy="14.5" r="1.5" fill="#FBBF24" />
          <path
            d="M19.5 9.5V14"
            stroke="#FBBF24"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!iconOnly && (
        <span className={cn("bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text font-display font-extrabold text-foreground tracking-tight", textSizes[size])}>
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
