import { FRAMEWORKS } from "@/lib/framework";

interface FrameworkLayoutProps {
  children: React.ReactNode;
  params: Promise<{ framework: string }>;
}

export async function generateStaticParams() {
  return FRAMEWORKS.map((fw) => ({
    framework: fw.id,
  }));
}

export default async function FrameworkLayout({
  children,
}: FrameworkLayoutProps) {
  return <>{children}</>;
}
