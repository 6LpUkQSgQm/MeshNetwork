import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from "./context/AuthContext";
import { MessageProvider } from "./context/MessageContext";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { ErrorProvider } from "./context/ErrorContext";
import "./i18n";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("Service Worker registration failed: ", registrationError);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorProvider>
      <AuthProvider>
        <CustomThemeProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </CustomThemeProvider>
      </AuthProvider>
    </ErrorProvider>
  </React.StrictMode>
);