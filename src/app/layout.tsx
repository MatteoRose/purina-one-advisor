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
  title: "Purina ONE Mini Advisor",
  description:
    "Personalized nutrition plans crafted just for your small dog. Find the perfect Purina ONE food in minutes.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Purina ONE Mini Advisor",
    description: "Personalized nutrition plans crafted just for your small dog.",
    type: "website",
    siteName: "Purina ONE Mini Advisor",
  },
  appleWebApp: {
    capable: true,
    title: "Purina ONE",
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
