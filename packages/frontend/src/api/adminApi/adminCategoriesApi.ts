import { apiRequest } from "../apiClient";
import type { Category } from "@prisma/client";

const adminCategoriesApi = {
  create: (data: Partial<Category>) =>
    apiRequest<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Category>) =>
    apiRequest<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/admin/categories/${id}`, { method: "DELETE" }),
};

export default adminCategoriesApi;
