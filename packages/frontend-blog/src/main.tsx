import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import Home from "./pages/Home/Home";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import "./index.css";
import { ThemeProvider } from "./context/themeProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/", // Layout route
    element: <App />, // Includes Navbar, Footer, and <Outlet />
    children: [
      { index: true, element: <Home /> }, // index route == "/"
      { path: "blog", element: <Blog /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>,
);
