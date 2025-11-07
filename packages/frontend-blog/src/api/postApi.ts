import { apiRequest } from "./apiClient";

const postApi = {
  getAll: () => apiRequest("/posts"),
  getBySlug: (slug: string) => apiRequest(`/posts/${slug}`),
  getComments: (id: string) => apiRequest(`/posts/${id}/comments`),

  likePost: (id: string) => apiRequest(`/posts/${id}/like`, { method: "POST" }),

  commentOnPost: (id: string, content: string) =>
    apiRequest(`/posts/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

export default postApi;
