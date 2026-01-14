"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsConfig } from "@/lib/docs-config";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-border md:sticky md:block">
      <div className="h-full overflow-y-auto py-6 pr-6 pl-4">
        <nav className="space-y-6">
          {docsConfig.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 px-2 text-sm font-semibold text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.disabled ? "#" : item.href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        item.disabled &&
                          "pointer-events-none opacity-50"
                      )}
                    >
                      {item.title}
                      {item.label && (
                        <span className="ml-2 rounded bg-hive-red/10 px-1.5 py-0.5 text-xs text-hive-red">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
