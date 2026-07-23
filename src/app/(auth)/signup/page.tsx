import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" description="Set up CampusTracker in under a minute.">
      <SignupForm />
    </AuthShell>
  );
}
