import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: `${APP_NAME} — Your academic life, organized`, template: `%s · ${APP_NAME}` },
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0e14" },
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
