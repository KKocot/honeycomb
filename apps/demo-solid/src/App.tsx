import { HiveProvider } from "@kkocot/honeycomb-solid";
import StatusDisplay from "./StatusDisplay";

export default function App() {
  return (
    <HiveProvider>
      <StatusDisplay />
    </HiveProvider>
  );
}
