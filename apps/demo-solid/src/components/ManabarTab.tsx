import { For } from "solid-js";
import { HiveManabar } from "@kkocot/honeycomb-solid";

const USERS = ["blocktrades", "barddev", "arcange"];

export default function ManabarTab() {
  return (
    <div class="space-y-6">
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Full Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Three rings showing Voting Power, Downvote, and Resource Credits with
          labels and cooldown.
        </p>
        <HiveManabar username="blocktrades" />
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Compact Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Smaller inline rings without labels.
        </p>
        <HiveManabar username="blocktrades" variant="compact" />
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Ring Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Single RC ring for minimal display.
        </p>
        <HiveManabar username="blocktrades" variant="ring" />
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">With Values</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Full variant with raw mana values displayed.
        </p>
        <HiveManabar username="blocktrades" showValues />
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Multiple Users</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Compact manabars for several users.
        </p>
        <div class="space-y-3">
          <For each={USERS}>
            {(user) => (
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium w-28">@{user}</span>
                <HiveManabar username={user} variant="compact" />
              </div>
            )}
          </For>
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Custom Styling</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Override styles with class prop.
        </p>
        <HiveManabar
          username="arcange"
          class="border border-hive-red/50 rounded-lg p-4"
        />
      </section>
    </div>
  );
}
