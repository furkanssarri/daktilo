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
      { path: "api/users/me", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
