import type { Metadata } from "next";
import { AccountDangerZone } from "@/components/settings/account-danger-zone";

export const metadata: Metadata = { title: "Account settings" };

export default function AccountSettingsPage() {
  return <AccountDangerZone />;
}
