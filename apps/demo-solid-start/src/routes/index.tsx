import { clientOnly } from "@solidjs/start";

const ClientApp = clientOnly(() => import("../ClientApp"));

export default function Home() {
  return (
    <ClientApp fallback={<div class="min-h-screen bg-background" />} />
  );
}
