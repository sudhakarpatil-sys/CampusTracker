import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "CampusTracker Mobile — Academic Companion",
  description: "Official CampusTracker Mobile Application for Students, Faculty, and Administrators.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CampusTracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0F17",
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-purple-500 selection:text-white font-sans">
      {children}
    </div>
  );
}
