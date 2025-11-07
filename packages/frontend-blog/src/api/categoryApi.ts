import { apiRequest } from "./apiClient";
import type { Category, Post } from "@prisma/client";

const categoryApi = {
  getAll: () => apiRequest<Category[]>("/categories"),
  getPostsByName: (name: string) =>
    apiRequest<Post[]>(`/categories/${name}/posts`),
};

export default categoryApi;
