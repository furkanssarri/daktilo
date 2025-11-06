import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/context/themeProvider.tsx";
import "./index.css";
import router from "@/routes/routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>,
);
