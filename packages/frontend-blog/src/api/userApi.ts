import { apiRequest } from "./apiClient";
import type { User, Comment } from "@prisma/client";

const userApi = {
  getMe: () => apiRequest<User>("/users/me"),
  getComments: () => apiRequest<Comment[]>("/users/me/comments"),
  updateMe: (data: Partial<User>) =>
    apiRequest<User>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiRequest<void>("/users/me/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export default userApi;
