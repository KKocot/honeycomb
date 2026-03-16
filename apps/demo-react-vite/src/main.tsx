import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HiveProvider } from "@hiveio/honeycomb-react";
import "@hiveio/honeycomb-react/styles.css";
import "./index.css";
import App from "./App";

const root_element = document.getElementById("root");
if (!root_element) throw new Error("Root element not found");

createRoot(root_element).render(
  <StrictMode>
    <HiveProvider>
      <App />
    </HiveProvider>
  </StrictMode>,
);
