import Link from "next/link";
import { GraduationCap } from "lucide-react";
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
  return (
    <footer className="border-t border-border/60 bg-card/60 py-12">
      <div className="container flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-extrabold text-foreground">{APP_NAME}</span>
          </Link>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Your entire academic life, effortlessly organized in one calm workspace.
          </p>
        </div>

        <div className="flex gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-10 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
        <span>Built for students, by students.</span>
      </div>
    </footer>
  );
}
