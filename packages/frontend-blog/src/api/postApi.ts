import { apiRequest } from "./apiClient";
import type { Post, Comment } from "@prisma/client";

const postApi = {
  getAll: () => apiRequest<Post[]>("/posts"),
  getBySlug: (slug: string) => apiRequest<Post>(`/posts/${slug}`),
  getComments: (id: string) => apiRequest<Comment[]>(`/posts/${id}/comments`),
  likePost: (id: string) =>
    apiRequest<void>(`/posts/${id}/like`, { method: "POST" }),
  commentOnPost: (id: string, content: string) =>
    apiRequest<Comment>(`/posts/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

export default postApi;
