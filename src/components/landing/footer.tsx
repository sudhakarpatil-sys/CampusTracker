import Link from "next/link";
import { NotebookPen } from "lucide-react";
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
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="container flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <NotebookPen className="h-4 w-4" />
            </span>
            {APP_NAME}
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">Your academic life, kept in the margins of one calm app.</p>
        </div>

        <div className="flex gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {APP_NAME}. Built for students, by students.
      </div>
    </footer>
  );
}
