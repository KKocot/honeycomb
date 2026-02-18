"use client";

import type { HealthCheckerService } from "@kkocot/honeycomb-core";

export interface HealthCheckerComponentProps {
  className?: string;
  healthCheckerService: HealthCheckerService;
}

export function HealthCheckerComponent({
  className,
  healthCheckerService,
}: HealthCheckerComponentProps) {
  return null;
}
