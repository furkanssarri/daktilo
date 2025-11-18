import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/unauthorized" replace />;

  if (user?.role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
