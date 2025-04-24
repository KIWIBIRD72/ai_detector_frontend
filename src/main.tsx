import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToasterProvider } from "./shared/providers/ToasterProvider.tsx";
import { TanstackProvider } from "./shared/providers/TanstackProvider.tsx";
import { App } from "./App.tsx";
import "./app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToasterProvider />
    <TanstackProvider>
      <App />
    </TanstackProvider>
  </StrictMode>,
);
