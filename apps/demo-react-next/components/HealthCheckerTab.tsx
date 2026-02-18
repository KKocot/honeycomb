"use client";

import { useState, useEffect, useRef } from "react";
import {
  useHiveChain,
  useApiEndpoint,
  HealthCheckerService,
  HealthCheckerComponent,
  type ApiChecker,
} from "@barddev/honeycomb-react";

const DEMO_ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://anyx.io",
  "https://techcoderx.com",
  "https://hive.roelandp.nl",
  "https://api.deathwing.me",
  "https://api.c0ff33a.uk",
  "https://hive-api.arcange.eu",
  "https://hive-api.3speak.tv",
  "https://hiveapi.actifit.io",
];

export default function HealthCheckerTab() {
  const chain = useHiveChain();
  const apiEndpoint = useApiEndpoint();
  const [hcService, setHcService] = useState<HealthCheckerService | null>(
    null
  );
  const [apiCheckers, setApiCheckers] = useState<ApiChecker[] | null>(null);
  const serviceRef = useRef<HealthCheckerService | null>(null);

  useEffect(() => {
    if (!chain) return;

    const checkers: ApiChecker[] = [
      {
        title: "Database - Find accounts",
        method: chain.api.database_api.find_accounts,
        params: { accounts: ["guest4test"], delayed_votes_active: false },
        validatorFunction: (data: any) =>
          data?.accounts?.[0]?.name === "guest4test"
            ? true
            : "Find accounts error",
      },
      {
        title: "Bridge - Get post",
        method: chain.api.bridge.get_post,
        params: { author: "guest4test", permlink: "6wpmjy-test", observer: "" },
        validatorFunction: (data: any) =>
          data?.author === "guest4test"
            ? true
            : "Bridge API get post error",
      },
      {
        title: "Bridge - Get Ranked Posts",
        method: chain.api.bridge.get_ranked_posts,
        params: { observer: "hive.blog", tag: "", limit: 10, sort: "trending" },
        validatorFunction: (data: any) =>
          data?.length > 0
            ? true
            : "Bridge API get ranked posts error",
      },
    ];

    setApiCheckers(checkers);
  }, [chain]);

  useEffect(() => {
    if (!apiCheckers || !chain) return;

    const service = new HealthCheckerService(
      "demo-react-hc",
      apiCheckers,
      DEMO_ENDPOINTS,
      apiEndpoint,
      (node: string | null) => {
        if (node) {
          chain.api.database_api.setEndpointUrl(node);
        }
      }
    );

    serviceRef.current = service;
    setHcService(service);

    return () => {
      service.stopCheckingProcess();
    };
  }, [apiCheckers]);

  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Health Checker</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Monitors Hive API endpoint health, latency and validity. Toggle
          continuous checking, switch to the best provider, or add custom nodes.
        </p>
        {hcService ? (
          <HealthCheckerComponent
            className="mt-4"
            healthCheckerService={hcService}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Waiting for chain connection...
          </p>
        )}
      </section>
    </div>
  );
}
