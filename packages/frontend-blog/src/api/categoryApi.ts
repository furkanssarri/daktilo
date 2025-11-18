import { apiRequest } from "./apiClient";
import type { Category, Post } from "@prisma/client";

const categoryApi = {
  getAll: async () => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { categories: Category[] };
    }>("/categories");

    return response.data.categories;
  },

  getPostsByName: async (name: string) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { category: Category & { posts: Post[] } };
    }>(`/categories/${name}/posts`);

    return response.data.category.posts;
  },
};

export default categoryApi;
