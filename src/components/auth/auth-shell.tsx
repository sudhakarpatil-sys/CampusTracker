import Link from "next/link";
import { NotebookPen, Quote } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Shared two-pane shell for every auth screen: form on the left, a quiet
 * editorial panel on the right that carries the brand's "notebook margin"
 * signature without repeating the dashboard mockup.
 */
export function AuthShell({ children, title, description }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-6 sm:p-10">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <NotebookPen className="h-4 w-4" />
          </span>
          {APP_NAME}
        </Link>

        <div className="mx-auto w-full max-w-sm py-10">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>

        <p className="text-center text-xs text-muted-foreground lg:text-left">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border/60 bg-surface lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_20%,hsl(var(--accent)/0.14),transparent)]"
        />
        <div className="flex h-full flex-col items-center justify-center gap-6 px-16 text-center">
          <Quote className="h-8 w-8 text-accent" />
          <p className="font-display text-2xl italic leading-snug">
            &quot;I stopped guessing my attendance percentage before every 8am lecture.&quot;
          </p>
          <p className="text-sm text-muted-foreground">Early CampusTracker user, final-year CS</p>
        </div>
      </div>
    </div>
  );
}
