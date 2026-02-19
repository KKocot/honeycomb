"use client";

import type { ReactNode } from "react";
import {
  HiveProvider,
  type HealthCheckerServiceConfig,
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

const healthCheckerServices: HealthCheckerServiceConfig[] = [
  {
    key: "demo-react-hc",
    defaultProviders: DEMO_ENDPOINTS,
    nodeAddress: null,
    onNodeChange: (node, chain) => {
      if (node) {
        chain.api.database_api.setEndpointUrl(node);
      }
    },
    createCheckers: (chain) => [
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
    ],
  },
];

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HiveProvider healthCheckerServices={healthCheckerServices}>
      {children}
    </HiveProvider>
  );
}
