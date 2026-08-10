"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Benefits", href: "#benefits" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/signup" },
    ],
  },
];

export function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      if (targetId === "product" || !targetId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          const yOffset = -72;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/60 bg-card/60 py-12 relative">
      <div className="container flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Link href="/" onClick={handleScrollToTop} title="Scroll to top">
            <Logo size="sm" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Your entire academic life, effortlessly organized in one calm workspace.
          </p>
        </div>

        <div className="flex gap-16 items-start">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Scroll to Top Action Button */}
          <div className="hidden sm:flex flex-col items-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleScrollToTop}
              title="Back to top"
              className="h-9 w-9 rounded-full border-border/80 hover:bg-indigo-500/10 hover:text-indigo-500 transition-all duration-200"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-[10px] text-muted-foreground font-mono">Back to top</span>
          </div>
        </div>
      </div>

      <div className="container mt-10 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
        <span>Built for students, by students.</span>
      </div>
    </footer>
  );
}
