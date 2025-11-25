import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/context/themeProvider.tsx";
import "./index.css";
import router from "@/routes/routes";
import { AuthProvider } from "./context/AuthContext";
import StartupGate from "@/components/custom/StartupGate";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <StartupGate>
          <RouterProvider router={router} />
        </StartupGate>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
