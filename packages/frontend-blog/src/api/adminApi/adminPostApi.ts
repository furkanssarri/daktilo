import { apiRequest } from "../apiClient";
import buildIncludeQuery from "@/utils/buildIncludeQuery";
import type { PostWithRelations } from "@/types/EntityTypes";
import type { Media as MediaType } from "@prisma/client";

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
      image: true,
    },
  ): Promise<PostWithRelations> => {
    const query = buildIncludeQuery(options);

    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: PostWithRelations };
    }>(`/admin/posts/id/${id}${query}`);

    if (!response.data?.post) {
      throw new Error("PostWithRelations not found");
    }

    return response.data.post;
  },
  getBySlug: async (
    slug: string,
    options: Partial<Record<string, boolean>> = {
      author: true,
      comments: true,
      categories: true,
      tags: true,
      image: true,
    },
  ): Promise<PostWithRelations> => {
    const query = buildIncludeQuery(options);

    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: PostWithRelations };
    }>(`/admin/posts/slug/${slug}${query}`);

    if (!response.data?.post) {
      throw new Error("PostWithRelations not found");
    }

    return response.data.post;
  },

  create: async (data: Partial<PostWithRelations>) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: PostWithRelations };
    }>("/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return response.data.post;
  },

  update: async (slug: string, data: Partial<PostWithRelations>) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: PostWithRelations };
    }>(`/admin/posts/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return response.data.post;
  },

  delete: (id: string) =>
    apiRequest<void>(`/admin/posts/${id}`, { method: "DELETE" }),

  publish: (id: string) =>
    apiRequest<PostWithRelations>(`/admin/posts/${id}/publish`, {
      method: "PUT",
    }),

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiRequest<{
      status: string;
      message: string;
      data: { media: MediaType };
    }>("/admin/posts/upload", {
      method: "POST",
      body: formData,
    });

    return response.data.media;
  },
};

export default adminPostsApi;
