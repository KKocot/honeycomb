import { For } from "solid-js";
import { BalanceCard } from "@barddev/honeycomb-solid";

const USERS = ["barddev", "blocktrades", "arcange"];
const ALL_USERS = ["barddev", "blocktrades", "arcange", "good-karma"];

export default function BalanceCardTab() {
  return (
    <div class="space-y-6">
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Default Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Card showing HIVE, HBD, and Hive Power balances.
        </p>
        <div class="max-w-sm">
          <BalanceCard username="blocktrades" />
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Compact Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Inline display of all balances.
        </p>
        <BalanceCard username="blocktrades" variant="compact" />
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Expanded Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Full breakdown with HP delegations and savings.
        </p>
        <div class="max-w-md">
          <BalanceCard username="blocktrades" variant="expanded" />
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Multiple Users</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Balance cards for different users.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={USERS}>
            {(user) => <BalanceCard username={user} />}
          </For>
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Compact List</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Compact balances in a vertical list.
        </p>
        <div class="space-y-2">
          <For each={ALL_USERS}>
            {(user) => <BalanceCard username={user} variant="compact" />}
          </For>
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Custom Styling</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Override styles with class prop.
        </p>
        <div class="max-w-sm">
          <BalanceCard
            username="arcange"
            class="border-hive-red/50 max-w-sm"
          />
        </div>
      </section>
    </div>
  );
}
