import type { Metadata } from "next";
import { NotebookPen } from "lucide-react";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Set up your account" };

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-12">
      <div className="mb-10 flex items-center gap-2 font-display text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <NotebookPen className="h-4 w-4" />
        </span>
        {APP_NAME}
      </div>
      <OnboardingFlow />
    </div>
  );
}
