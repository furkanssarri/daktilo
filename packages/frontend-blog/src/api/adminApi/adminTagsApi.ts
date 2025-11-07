import { apiRequest } from "../apiClient";
import type { Tag } from "@prisma/client";

const adminTagApi = {
  create: (
    data: Tag, // TODO: check if this type is applicable in this context.
  ) =>
    apiRequest("admin/tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Tag) =>
    apiRequest(`/admin/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => apiRequest(`/admin/tags/${id}`, { method: "DELETE" }),
};

export default adminTagApi;
