import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { UiProvider } from "./context/UiContext";
import { ensureDataVersion } from "./data/storage";
import "./index.css";
import "./styles/dashboard.css"

ensureDataVersion();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UiProvider>
        <App />
      </UiProvider>
    </BrowserRouter>
  </React.StrictMode>
);