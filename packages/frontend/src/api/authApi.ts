import { apiRequest } from "./apiClient";

type AuthResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => apiRequest<AuthResponse>("/auth/logout"),
};

export default authApi;
