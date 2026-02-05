"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { cn } from "@/lib/utils";
import { FRAMEWORKS, type Framework } from "@/lib/framework";

interface FrameworkSelectorProps {
  activeFramework: Framework;
}

export function FrameworkSelector({ activeFramework }: FrameworkSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticFramework, setOptimisticFramework] =
    useOptimistic(activeFramework);

  const handleSelect = (framework: Framework) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("framework", framework);
    startTransition(() => {
      setOptimisticFramework(framework);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        isPending && "opacity-70"
      )}
    >
      {FRAMEWORKS.map((fw) => (
        <button
          key={fw.id}
          onClick={() => handleSelect(fw.id)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
            optimisticFramework === fw.id
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50 hover:text-foreground"
          )}
        >
          {fw.label}
        </button>
      ))}
    </div>
  );
}
