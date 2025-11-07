import { apiRequest } from "./apiClient";
import type { User } from "@prisma/client";

const userApi = {
  getMe: () => apiRequest("/users/me"),
  updateMe: (
    data: User, // TODO: make sure this type is applicable in this context.
  ) =>
    apiRequest("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiRequest("/users/me/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export default userApi;
