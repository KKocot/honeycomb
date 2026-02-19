import { HiveProvider } from "@barddev/honeycomb-solid";
import StatusDisplay from "./StatusDisplay";

export default function ClientApp() {
  return (
    <HiveProvider>
      <StatusDisplay />
    </HiveProvider>
  );
}
