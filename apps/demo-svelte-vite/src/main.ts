import { mount } from "svelte";
import App from "./App.svelte";
import "@hiveio/honeycomb-svelte/styles.css";
import "./app.css";

const root_element = document.getElementById("root");

if (!root_element) {
  throw new Error("Root element not found");
}

mount(App, { target: root_element });
