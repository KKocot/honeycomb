import type { Metadata } from "next";
import { Providers } from "../components/Providers";
import "@hiveio/honeycomb-react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honeycomb React Demo",
  description: "Minimal demo of @hiveio/honeycomb-react HiveProvider",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased bg-hive-background text-hive-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
