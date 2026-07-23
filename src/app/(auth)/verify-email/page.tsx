import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Verify your email" };

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Verify your email" description="One more step before you can log in.">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <MailCheck className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your inbox. Click it to activate your account, then log in below.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Go to log in</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
