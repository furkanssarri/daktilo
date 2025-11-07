import { apiRequest } from "../apiClient";
import type { Post } from "@prisma/client";

const adminPostsApi = {
  getAll: () => apiRequest("/admin/posts"),
  getById: (id: string) => apiRequest(`/admin/posts/${id}`),
  create: (
    data: Post, // TODO: check if this type is applicable in this context.
  ) =>
    apiRequest("/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Post) =>
    apiRequest(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/admin/posts/${id}`, { method: "DELETE" }),
  publish: (id: string) =>
    apiRequest(`/admin/posts/${id}/publish`, { method: "PUT" }),
};

export default adminPostsApi;
