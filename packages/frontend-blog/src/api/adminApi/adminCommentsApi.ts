import { apiRequest } from "../apiClient";
import type { Comment } from "@prisma/client";

const adminCommentApi = {
  getAll: () => apiRequest<Comment[]>("/admin/comments"),
  delete: (id: string) =>
    apiRequest<void>(`/admin/comments/${id}`, { method: "DELETE" }),
  approveDisapprove: (id: string, value: boolean) =>
    apiRequest<Comment>(`/admin/comments/${id}/approve`, {
      method: "PUT",
      body: JSON.stringify({ approved: value }),
    }),
};

export default adminCommentApi;
