"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, NotebookPen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-40 transition-colors", scrolled ? "glass" : "border-b border-transparent")}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <NotebookPen className="h-4 w-4" />
          </span>
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass border-t border-border/60 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
