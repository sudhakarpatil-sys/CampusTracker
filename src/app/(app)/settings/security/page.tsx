import type { Metadata } from "next";
import { SecurityForm } from "@/components/settings/security-form";

export const metadata: Metadata = { title: "Security settings" };

export default function SecuritySettingsPage() {
  return <SecurityForm />;
}
