// import React from 'react'
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import CurrentUserContextProvider from "./context/CurrentUserContextProvider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CurrentUserContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </CurrentUserContextProvider>
);
