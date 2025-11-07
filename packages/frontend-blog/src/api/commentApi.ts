import { apiRequest } from "./apiClient";
import type { Comment } from "@prisma/client";

const commentApi = {
  create: (data: { content: string; postId: string }) =>
    apiRequest<Comment>("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { content: string }) =>
    apiRequest<Comment>(`/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/comments/${id}`, { method: "DELETE" }),
};

export default commentApi;
