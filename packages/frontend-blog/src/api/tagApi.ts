import { apiRequest } from "./apiClient";
import type { Tag, Post } from "@prisma/client";

const tagApi = {
  getAll: async () => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { tags: Tag[] };
    }>("/tags");

    return response.data.tags;
  },

  getPostsBySlug: async (slug: string) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { tag: { id: string; name: string; posts: Post[] } };
    }>(`/tags/${slug}/posts`);

    return response.data.tag.posts;
  },
};

export default tagApi;
