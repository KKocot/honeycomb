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

const WALLET_ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://anyx.io",
  "https://techcoderx.com",
  "https://hive.roelandp.nl",
  "https://api.deathwing.me",
];

const healthCheckerServices: HealthCheckerServiceConfig[] = [
  {
    key: "hive-node-api",
    defaultProviders: DEMO_ENDPOINTS,
    nodeAddress: null,
    onNodeChange: (node, chain) => {
      if (node) {
        chain.endpointUrl = node;
      }
    },
    createCheckers: (chain) => {
      // bridge API exists at runtime but is not in the typed wax interface
      const api = chain.api as any;
      return [
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
          method: api.bridge.get_post,
          params: { author: "guest4test", permlink: "6wpmjy-test", observer: "" },
          validatorFunction: (data: any) =>
            data?.author === "guest4test"
              ? true
              : "Bridge API get post error",
        },
        {
          title: "Bridge - List Communities",
          method: api.bridge.list_communities,
          params: { query: null, sort: "rank", observer: "hive.blog" },
          validatorFunction: (data: any) =>
            data?.length > 0
              ? true
              : "Bridge API list communities error",
        },
        {
          title: "Bridge - Get Ranked Posts",
          method: api.bridge.get_ranked_posts,
          params: { observer: "hive.blog", tag: "", limit: 10, sort: "trending" },
          validatorFunction: (data: any) =>
            data?.length > 0
              ? true
              : "Bridge API get ranked posts error",
        },
      ];
    },
  },
  {
    key: "hive-wallet-api",
    defaultProviders: WALLET_ENDPOINTS,
    nodeAddress: null,
    onNodeChange: (node, chain) => {
      if (node) {
        chain.endpointUrl = node;
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
        title: "Database - Dynamic global properties",
        method: chain.api.database_api.get_dynamic_global_properties,
        params: {},
        validatorFunction: (data: any) =>
          !!data?.head_block_number
            ? true
            : "Dynamic global properties error",
      },
      {
        title: "Database - Find witnesses",
        method: chain.api.database_api.find_witnesses,
        params: { owners: ["gtg"] },
        validatorFunction: (data: any) =>
          data?.witnesses?.[0]?.owner === "gtg"
            ? true
            : "Find witnesses error",
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
