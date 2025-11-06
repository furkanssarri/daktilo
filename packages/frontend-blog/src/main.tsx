import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import Home from "@/pages/Home/Home";
import Blog from "@/pages/Blog/Blog";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import Post from "@/pages/Post/Post.tsx";
import NotFound from "@/pages/NotFound/NotFound";

import { ThemeProvider } from "@/context/themeProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:postId", element: <Post /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
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
