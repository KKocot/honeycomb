import { HiveProvider } from "@barddev/honeycomb-solid";
import StatusDisplay from "./StatusDisplay";

export default function App() {
  return (
    <HiveProvider>
      <StatusDisplay />
    </HiveProvider>
  );
}
