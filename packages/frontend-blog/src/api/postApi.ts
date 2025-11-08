import { apiRequest } from "./apiClient";
import type { Post, Comment } from "@prisma/client";

const postApi = {
  // ✅ Unwraps the { data: { posts } } structure from the backend
  getAll: async () => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { posts: Post[] };
    }>("/posts");
    return response.data.posts;
  },

  // ✅ Similarly unwraps the single post object
  getBySlug: async (slug: string) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: Post };
    }>(`/posts/${slug}`);
    return response.data.post;
  },

  // ✅ Same idea for comments
  getComments: async (id: string) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comments: Comment[] };
    }>(`/posts/${id}/comments`);
    return response.data.comments;
  },

  likePost: (id: string) =>
    apiRequest<void>(`/posts/${id}/like`, { method: "POST" }),

  commentOnPost: (id: string, content: string) =>
    apiRequest<Comment>(`/posts/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

export default postApi;
