import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./configs/i18n.ts";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>,
);

// Registro do Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/pwa/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registrado com sucesso:", registration);
      })
      .catch((error) => {
        console.error("Erro ao registrar o Service Worker:", error);
      });
  });
}
