import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider";


ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="gamehub-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);