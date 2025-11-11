import { apiRequest } from "../apiClient";
import buildIncludeQuery from "@/utils/buildIncludeQuery";
import type { PostWithRelations } from "@/types/EntityTypes";

const adminPostsApi = {
  /**
   * Get all posts as an admin.
   * @param options Which relations to include (author, comments, categories, tags)
   */
  getAll: async (
    options: Partial<Record<string, boolean>> = {
      author: true,
      comments: true,
      categories: true,
      tags: true,
    },
  ): Promise<PostWithRelations[]> => {
    const query = buildIncludeQuery(options);

    const response = await apiRequest<{
      status: string;
      message: string;
      data: { posts: PostWithRelations[] };
    }>(`/admin/posts${query}`);

    if (!response.data?.posts) {
      return [];
    }

    return response.data.posts;
  },

  getById: async (
    id: string,
    options: Partial<Record<string, boolean>> = {
      author: true,
      comments: true,
      categories: true,
      tags: true,
    },
  ): Promise<PostWithRelations> => {
    const query = buildIncludeQuery(options);

    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: PostWithRelations };
    }>(`/admin/posts/${id}${query}`);

    if (!response.data?.post) {
      throw new Error("PostWithRelations not found");
    }

    return response.data.post;
  },

  create: (data: Partial<PostWithRelations>) =>
    apiRequest<PostWithRelations>("/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<PostWithRelations>) =>
    apiRequest<PostWithRelations>(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/admin/posts/${id}`, { method: "DELETE" }),

  publish: (id: string) =>
    apiRequest<PostWithRelations>(`/admin/posts/${id}/publish`, {
      method: "PUT",
    }),
};

export default adminPostsApi;
