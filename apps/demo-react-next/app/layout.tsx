import type { Metadata } from "next";
import { HiveProvider } from "@barddev/honeycomb-react";
// All-in-one: CSS vars + component styles + pre-compiled Tailwind utilities + theme tokens
import "@barddev/honeycomb-react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honeycomb React Demo",
  description: "Minimal demo of @barddev/honeycomb-react HiveProvider",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased bg-hive-background text-hive-foreground">
        <HiveProvider>{children}</HiveProvider>
      </body>
    </html>
  );
}
