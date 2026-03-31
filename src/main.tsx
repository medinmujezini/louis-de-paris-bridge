import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isInUnrealEngine } from "./lib/ue-bridge";

if (isInUnrealEngine()) {
  document.body.classList.add("ue-embedded");
}

createRoot(document.getElementById("root")!).render(<App />);
