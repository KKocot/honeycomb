import type { Metadata } from "next";
import { HiveProvider } from "@barddev/honeycomb-react";
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
      <body className="min-h-screen antialiased">
        <HiveProvider>{children}</HiveProvider>
      </body>
    </html>
  );
}
