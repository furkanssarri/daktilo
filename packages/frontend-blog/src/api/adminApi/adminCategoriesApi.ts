import { apiRequest } from "../apiClient";
import type { Category } from "@prisma/client";

const adminCategoriesApi = {
  create: (data: Category) =>
    apiRequest("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Category) =>
    apiRequest(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/admin/categories/${id}`, { method: "DELETE" }),
};

export default adminCategoriesApi;
