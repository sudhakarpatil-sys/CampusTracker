"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarUpload } from "@/components/shared/avatar-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { DEPARTMENTS, SEMESTERS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

export function ProfileForm() {
  const { user, profile, isLoading, refreshProfile } = useUser();
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema) });

  React.useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name ?? "",
        collegeName: profile.college_name ?? "",
        department: profile.department ?? "",
        branch: profile.branch ?? "",
        semester: profile.semester ?? "",
        academicYear: profile.academic_year ?? "",
        rollNumber: profile.roll_number ?? "",
      });
    }
  }, [profile, reset]);

  async function handleAvatarSelected(file: File) {
    if (!user) return;
    setAvatarFile(file);
    setIsUploadingAvatar(true);
    const supabase = createClient();
    const path = `${user.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    if (!error) {
      const avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
      await refreshProfile();
      toast({ title: "Profile picture updated" });
    } else {
      toast({ title: "Upload failed", description: error.message });
    }
    setIsUploadingAvatar(false);
  }

  async function onSubmit(values: ProfileInput) {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.fullName,
        college_name: values.collegeName,
        department: values.department,
        branch: values.branch,
        semester: values.semester,
        academic_year: values.academicYear,
        roll_number: values.rollNumber,
      })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Couldn't save changes", description: error.message });
      return;
    }
    await refreshProfile();
    toast({ title: "Profile updated" });
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This information is used across your dashboard and reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUpload name={watch("fullName")} imageUrl={profile?.avatar_url} onFileSelected={handleAvatarSelected} isUploading={isUploadingAvatar} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collegeName">College</Label>
              <Input id="collegeName" {...register("collegeName")} />
              {errors.collegeName && <p className="text-xs text-destructive">{errors.collegeName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={watch("department")} onValueChange={(v) => setValue("department", v, { shouldDirty: true })}>
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
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" {...register("branch")} />
            </div>
            <div className="space-y-1.5">
              <Label>Semester</Label>
              <Select value={watch("semester")} onValueChange={(v) => setValue("semester", v, { shouldDirty: true })}>
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
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="academicYear">Academic year</Label>
              <Input id="academicYear" {...register("academicYear")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rollNumber">Roll number</Label>
              <Input id="rollNumber" {...register("rollNumber")} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t border-border/60 pt-6">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
