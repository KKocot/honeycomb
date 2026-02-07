import type { Metadata } from "next";
import { HiveProvider } from "@/contexts/hive-context";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hive UI Demo",
  description: "Demo of all Hive UI components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <ToastProvider>
          <HiveProvider>
            {children}
          </HiveProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
