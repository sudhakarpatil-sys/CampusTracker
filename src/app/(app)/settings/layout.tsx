import { PageHeader } from "@/components/shared/page-header";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, appearance, and account." />
      <SettingsTabs />
      <div className="max-w-2xl">{children}</div>
    </div>
  );
}
