import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
