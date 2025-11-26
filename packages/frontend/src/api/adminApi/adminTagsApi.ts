import { apiRequest } from "../apiClient";
import type { Tag } from "@prisma/client";

const adminTagApi = {
  create: (data: Partial<Tag>) =>
    apiRequest<Tag>("/admin/tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Tag>) =>
    apiRequest<Tag>(`/admin/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/admin/tags/${id}`, { method: "DELETE" }),
};

export default adminTagApi;
