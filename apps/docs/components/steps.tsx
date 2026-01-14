import { cn } from "@/lib/utils";

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export function Steps({ children, className }: StepsProps) {
  return (
    <div className={cn("relative space-y-4 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border", className)}>
      {children}
    </div>
  );
}

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="relative">
      <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-xs font-medium">
        <div className="h-2 w-2 rounded-full bg-hive-red" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-2 text-muted-foreground">{children}</div>
    </div>
  );
}
