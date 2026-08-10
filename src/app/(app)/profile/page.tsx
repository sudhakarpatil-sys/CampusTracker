import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = { title: "Profile — CampusTracker" };

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
    : { data: null };

  return <ProfileView profile={profile} email={user?.email} />;
}
