import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { RoleSwitcher } from "@/components/dev/role-switcher";
import { AiAssistantWidget } from "@/components/feedback/ai-assistant-widget";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Niger State GeoHealth Portal",
    template: "%s · Niger State GeoHealth Portal",
  },
  description:
    "Niger State's centralised geospatial and health data platform — disease surveillance, facility mapping, analytics, and open health datasets across 25 LGAs.",
  openGraph: {
    title: "Niger State GeoHealth Portal",
    description: "Health data portal for evidence-based planning across Niger State.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <AiAssistantWidget />
          <RoleSwitcher />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
