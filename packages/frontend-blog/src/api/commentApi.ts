import { apiRequest } from "./apiClient";

const commentApi = {
  create: (data: { content: string; postId: string }) =>
    apiRequest("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { content: string }) =>
    apiRequest(`/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => apiRequest(`/comments/${id}`, { method: "DELETE" }),
};

export default commentApi;
