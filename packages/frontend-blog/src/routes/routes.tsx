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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "blog", element: <Blog /> },
      { path: "posts/id/:postId", element: <BlogPost /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "auth/signup", element: <Signup /> },
      { path: "auth/login", element: <Login /> },
      { path: "users/me", element: <Profile /> },
      { path: "admin/me", element: <AdminDashboard /> },
      { path: "admin/posts/", element: <AdminAllPosts /> },
      { path: "admin/posts/slug/:slug", element: <AdminPost /> },
      { path: "admin/posts/create", element: <CreatePost /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
