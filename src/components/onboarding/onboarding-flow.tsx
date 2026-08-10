"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarUpload } from "@/components/shared/avatar-upload";
import { createClient } from "@/lib/supabase/client";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/onboarding";
import { detectRoleFromEmail } from "@/lib/validations/auth";
import { DEPARTMENTS, SEMESTERS } from "@/lib/constants";
import { useUser } from "@/hooks/use-user";
import { toast } from "@/hooks/use-toast";

const STEPS: { title: string; fields: (keyof OnboardingInput)[] }[] = [
  { title: "About you", fields: ["fullName"] },
  { title: "Your institution", fields: ["collegeName", "university", "department", "branch"] },
  { title: "Academic details", fields: ["semester", "academicYear", "rollNumber", "batch"] },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { user, refreshProfile } = useUser();
  const [step, setStep] = React.useState(0);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({ resolver: zodResolver(onboardingSchema), mode: "onTouched" });

  const progress = ((step + 1) / STEPS.length) * 100;

  async function handleNext() {
    const valid = await trigger(STEPS[step]!.fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(values: OnboardingInput) {
    if (!user) return;
    const supabase = createClient();
    let avatarUrl: string | null = null;

    if (avatarFile) {
      const path = `${user.id}/avatar-${Date.now()}.${avatarFile.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      if (!uploadError) {
        avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }
    }

    const detectedRole = detectRoleFromEmail(user.email);

    const payload: Record<string, unknown> = {
      id: user.id,
      role: detectedRole,
      full_name: values.fullName,
      college_name: values.collegeName,
      university: values.university,
      department: values.department,
      branch: values.branch,
      semester: values.semester,
      academic_year: values.academicYear,
      roll_number: values.rollNumber,
      batch: values.batch || null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    if (avatarUrl) {
      payload.avatar_url = avatarUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(payload as never);

    if (error) {
      toast({ title: "Couldn't save your profile", description: error.message });
      return;
    }

    // Sync onboarding state into Supabase Auth user metadata for zero-delay middleware checks
    await supabase.auth.updateUser({ data: { onboarding_completed: true } });

    await refreshProfile();
    toast({ title: "You're all set", description: "Welcome to CampusTracker." });
    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step]!.title}</span>
        </div>
        <Progress value={progress} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {step === 0 && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <AvatarUpload name={watch("fullName")} onFileSelected={setAvatarFile} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Aditi Sharma" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="collegeName">College name</Label>
              <Input id="collegeName" placeholder="Institute of Technology" {...register("collegeName")} />
              {errors.collegeName && <p className="text-xs text-destructive">{errors.collegeName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="university">University</Label>
              <Input id="university" placeholder="State University" {...register("university")} />
              {errors.university && <p className="text-xs text-destructive">{errors.university.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select onValueChange={(v) => setValue("department", v, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" placeholder="e.g. AI & ML" {...register("branch")} />
                {errors.branch && <p className="text-xs text-destructive">{errors.branch.message}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Semester</Label>
                <Select onValueChange={(v) => setValue("semester", v, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((s) => (
                      <SelectItem key={s} value={s}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semester && <p className="text-xs text-destructive">{errors.semester.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="academicYear">Academic year</Label>
                <Input id="academicYear" placeholder="2025-2026" {...register("academicYear")} />
                {errors.academicYear && <p className="text-xs text-destructive">{errors.academicYear.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rollNumber">Roll number</Label>
              <Input id="rollNumber" placeholder="21CS1042" {...register("rollNumber")} />
              {errors.rollNumber && <p className="text-xs text-destructive">{errors.rollNumber.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="batch">Batch (optional)</Label>
              <Input id="batch" placeholder="e.g. A1" {...register("batch")} />
              <p className="text-xs text-muted-foreground">
                If your division splits into batches for labs/practicals, enter yours — named after your
                division, e.g. A1 or A2 for Division A. Leave blank if not applicable.
              </p>
              {errors.batch && <p className="text-xs text-destructive">{errors.batch.message}</p>}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Finish setup
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
