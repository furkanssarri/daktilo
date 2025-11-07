import { apiRequest } from "../apiClient";

const adminCommentApi = {
  getAll: () => apiRequest("/admin/comments"),
  delete: (id: string) =>
    apiRequest(`/admin/comments/${id}`, { method: "DELETE" }),
  approveDisapprove: (id: string, value: boolean) =>
    apiRequest(`/admin/comments/${id}/approve`, {
      method: "PUT",
      body: JSON.stringify({ approved: value }),
    }),
};

export default adminCommentApi;
