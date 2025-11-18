import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if(isLoading) return <div>Loading...</div>

  if (!isAuthenticated) return <Navigate to="/unauthorized" replace />;

  if (user?.role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
