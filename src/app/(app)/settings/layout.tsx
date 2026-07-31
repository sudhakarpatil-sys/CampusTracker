import { SettingsHero } from "@/components/settings/settings-hero";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <SettingsHero />
      <SettingsTabs />
      <div className="max-w-2xl">{children}</div>
    </div>
  );
}
