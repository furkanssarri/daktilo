import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { setLogoutCallback } from "@/api/apiClient";

interface DecodedToken {
  id: string;
  email: string;
  username?: string | null;
  role: "ADMIN" | "USER";
  exp: number;
}

interface AuthContextValue {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  // Decode and set user state from token
  const refreshAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.clear();
          setUser(null);
        }
      } catch {
        localStorage.clear();
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Run on mount
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Log out user
  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  // Register logout callback for API client
  useEffect(() => {
    setLogoutCallback(logout);

    // React to manual auth changes (login/logout within same tab)
    const handleAuthChange = () => refreshAuth();
    window.addEventListener("auth-change", handleAuthChange);

    // React to cross-tab login/logout
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" || event.key === "refreshToken") {
        refreshAuth();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [logout, refreshAuth]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, logout, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
