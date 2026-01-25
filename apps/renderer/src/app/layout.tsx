import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hive Renderer Demo",
  description: "Live demo of Markdown content renderer for Hive blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
