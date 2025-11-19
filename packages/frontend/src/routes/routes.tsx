import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog/Blog";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import BlogPost from "@/pages/Blog/BlogPost";
import NotFound from "@/pages/NotFound/NotFound";
import Signup from "@/pages/Auth/Signup";
import Login from "@/pages/Auth/Login";
import Profile from "@/pages/User/Profile";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminAllPosts from "@/pages/Admin/AdminAllPosts";
import AdminPost from "@/pages/Admin/AdminPost";
import CreatePost from "@/pages/Admin/CreatePost";
import EditPost from "@/pages/Admin/EditPost";
import Unauthorized from "@/pages/Auth/Unauthorized";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AdminRoute from "@/components/Auth/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      // Public blog routes
      { path: "blog", element: <Blog /> },
      { path: "posts/slug/:slug", element: <BlogPost /> },

      // Auth
      { path: "auth/signup", element: <Signup /> },
      { path: "auth/login", element: <Login /> },

      // Unauthorized page
      { path: "unauthorized", element: <Unauthorized /> },

      // Protected user routes
      {
        element: <ProtectedRoute />,
        children: [{ path: "users/me", element: <Profile /> }],
      },

      // Admin-only routes
      {
        element: <AdminRoute />,
        children: [
          { path: "admin/me", element: <AdminDashboard /> },
          { path: "admin/posts", element: <AdminAllPosts /> },
          { path: "admin/posts/create", element: <CreatePost /> },
          { path: "admin/posts/slug/:slug", element: <AdminPost /> },
          { path: "admin/posts/slug/:slug/edit", element: <EditPost /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
