import { BalanceCard } from "@barddev/honeycomb-react";

const DEMO_USERS = ["barddev", "blocktrades", "arcange", "good-karma"];

export default function BalanceCardTab() {
  return (
    <div className="space-y-6">
      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Default Variant</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Card showing HIVE, HBD, and Hive Power balances.
        </p>
        <div className="max-w-sm">
          <BalanceCard username="blocktrades" />
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Compact Variant</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Inline display of all balances.
        </p>
        <BalanceCard username="blocktrades" variant="compact" />
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Expanded Variant</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Full breakdown with HP delegations and savings.
        </p>
        <div className="max-w-md">
          <BalanceCard username="blocktrades" variant="expanded" />
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Multiple Users</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Balance cards for different users.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["barddev", "blocktrades", "arcange"].map((user) => (
            <BalanceCard key={user} username={user} />
          ))}
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Compact List</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Compact balances in a vertical list.
        </p>
        <div className="space-y-2">
          {DEMO_USERS.map((user) => (
            <BalanceCard key={user} username={user} variant="compact" />
          ))}
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Custom Styling</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Override styles with className prop.
        </p>
        <div className="max-w-sm">
          <BalanceCard
            username="arcange"
            className="border-hive-red/50 max-w-sm"
          />
        </div>
      </section>
    </div>
  );
}
