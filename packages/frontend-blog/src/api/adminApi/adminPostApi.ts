import { apiRequest } from "../apiClient";
import type { Post } from "@prisma/client";

const adminPostsApi = {
  getAll: () => apiRequest<Post[]>("/admin/posts"),

  getById: (id: string) => apiRequest<Post>(`/admin/posts/${id}`),

  create: (data: Partial<Post>) =>
    apiRequest<Post>("/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Post>) =>
    apiRequest<Post>(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/admin/posts/${id}`, { method: "DELETE" }),

  publish: (id: string) =>
    apiRequest<Post>(`/admin/posts/${id}/publish`, { method: "PUT" }),
};

export default adminPostsApi;
