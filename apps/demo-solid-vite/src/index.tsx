import { render } from "solid-js/web";
import App from "./App";
import "@barddev/honeycomb-solid/styles.css";
import "./index.css";

const root_element = document.getElementById("root");

if (!root_element) {
  throw new Error("Root element not found");
}

render(() => <App />, root_element);
