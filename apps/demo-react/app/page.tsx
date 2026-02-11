"use client";

import { useState } from "react";
import ApiTrackerTab from "../components/ApiTrackerTab";
import HooksTab from "../components/HooksTab";
import AvatarTab from "../components/AvatarTab";
import UserCardTab from "../components/UserCardTab";
import BalanceCardTab from "../components/BalanceCardTab";
import ManabarTab from "../components/ManabarTab";

type TabId =
  | "api-tracker"
  | "hooks"
  | "avatar"
  | "user-card"
  | "balance-card"
  | "manabar";

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "api-tracker", label: "API Tracker" },
  { id: "hooks", label: "Hooks" },
  { id: "avatar", label: "Avatar" },
  { id: "user-card", label: "User Card" },
  { id: "balance-card", label: "Balance Card" },
  { id: "manabar", label: "Manabar" },
];

export default function HomePage() {
  const [active_tab, set_active_tab] = useState<TabId>("api-tracker");

  return (
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-hive-red">
        Honeycomb React Demo
      </h1>

      <nav role="tablist" className="flex border-b border-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={active_tab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => set_active_tab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              active_tab === tab.id
                ? "border-b-2 border-hive-red text-hive-red"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        role="tabpanel"
        id={`tabpanel-${active_tab}`}
        aria-labelledby={`tab-${active_tab}`}
      >
        {active_tab === "api-tracker" && <ApiTrackerTab />}
        {active_tab === "hooks" && <HooksTab />}
        {active_tab === "avatar" && <AvatarTab />}
        {active_tab === "user-card" && <UserCardTab />}
        {active_tab === "balance-card" && <BalanceCardTab />}
        {active_tab === "manabar" && <ManabarTab />}
      </div>
    </main>
  );
}
