import type { Metadata } from "next";
import { AppearanceForm } from "@/components/settings/appearance-form";

export const metadata: Metadata = { title: "Appearance settings" };

export default function AppearanceSettingsPage() {
  return <AppearanceForm />;
}
