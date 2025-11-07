import { apiRequest } from "./apiClient";

const authApi = {
  signup: (data: { username: string; email: string; passwor: string }) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => apiRequest("/auth/logout"),
};

export default authApi;
