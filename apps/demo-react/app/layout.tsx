import type { Metadata } from "next";
import { HiveProvider } from "@kkocot/honeycomb-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honeycomb React Demo",
  description: "Minimal demo of @kkocot/honeycomb-react HiveProvider",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <HiveProvider>{children}</HiveProvider>
      </body>
    </html>
  );
}
