// import { createRoot } from "react-dom/client";
// import App from "./App";

// // CSS ni o'qish (build paytida inline bo'ladi)
// import cssString from "./index.css?inline";

// (function () {
//   console.log("🚀 Chat Widget initializing...");

//   function init() {
//     if (document.getElementById("chat-widget-host")) return;

//     // Host element yaratish
//     const hostElement = document.createElement("div");
//     hostElement.id = "chat-widget-host";
//     document.body.appendChild(hostElement);

//     // Shadow DOM yaratish (izolyatsiya)
//     const shadowRoot = hostElement.attachShadow({ mode: "open" });

//     // Shadow DOM ichida container yaratish
//     const container = document.createElement("div");
//     container.id = "chat-widget-root";
//     shadowRoot.appendChild(container);

//     // CSS ni Shadow DOM ichiga qo'shish
//     const style = document.createElement("style");
//     style.textContent = cssString;
//     shadowRoot.appendChild(style);

//     // React Root yaratish
//     const root = createRoot(container);
//     root.render(<App />);

//     console.log("✅ Chat Widget loaded with Shadow DOM");
//   }

//   if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", init);
//   } else {
//     init();
//   }
// })();

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("chat-widget-root")).render(<App />);
