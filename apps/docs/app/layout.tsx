import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Honeycomb - Components for Hive Blockchain",
  description:
    "Beautiful, accessible components for building Hive Blockchain applications. Copy and paste into your apps. Open source.",
  keywords: ["hive", "blockchain", "components", "react", "ui", "shadcn"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
