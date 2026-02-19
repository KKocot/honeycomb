// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const app_root = document.getElementById("app");
if (app_root) {
  mount(() => <StartClient />, app_root);
}
