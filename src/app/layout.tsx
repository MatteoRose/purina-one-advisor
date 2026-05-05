import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "KIN Advisor — by Purina ONE",
  description:
    "Personalized nutrition plans for every dog's body, life stage and need. KIN Advisor — Small Dog. Big Love. Visibly.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "KIN Advisor — by Purina ONE",
    description:
      "Personalized nutrition plans for every dog. Small Dog. Big Love. Visibly.",
    type: "website",
    siteName: "KIN Advisor",
  },
  appleWebApp: {
    capable: true,
    title: "KIN Advisor",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-bg-main text-text-body min-h-screen antialiased`}
      >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
