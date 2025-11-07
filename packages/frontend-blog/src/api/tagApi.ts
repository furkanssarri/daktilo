import { apiRequest } from "./apiClient";
import type { Tag, Post } from "@prisma/client";

const tagApi = {
  getAll: () => apiRequest<Tag[]>("/tags"),
  getPostsBySlug: (slug: string) => apiRequest<Post[]>(`/tags/${slug}/posts`),
};

export default tagApi;
