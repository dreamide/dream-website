import { ShisoApp } from "@umami/shiso/client";
import { hydrateRoot } from "react-dom/client";
import "./styles.css";

const element = document.getElementById("root");

if (!element) {
  throw new Error("Shiso could not find the root element.");
}

hydrateRoot(element, <ShisoApp />);

const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

if (!localHosts.has(window.location.hostname)) {
  const analytics = document.createElement("script");
  analytics.defer = true;
  analytics.src = "/u.js";
  analytics.dataset.websiteId = "7ade14cb-bcb8-431f-9f5e-a0787c7cf311";
  document.head.appendChild(analytics);
}
