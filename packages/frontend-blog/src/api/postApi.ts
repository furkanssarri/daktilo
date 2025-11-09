import type { PostWithRelations } from "@/types/EntityTypes";
import { apiRequest } from "./apiClient";
import type { Post as PostType, Comment } from "@prisma/client";

/**
 * Helper to build query string for includes
 * Converts { author: true, comments: true } → ?include=author,comments
 */
function buildIncludeQuery(options?: Partial<Record<string, boolean>>): string {
  if (!options) return "";
  const includeKeys = Object.keys(options).filter((key) => options[key]);
  return includeKeys.length ? `?include=${includeKeys.join(",")}` : "";
}

const postApi = {
  /**
   * Get all published posts.
   * @param options Which relations to include (author, comments, category, tags, likes)
   * @example postApi.getAll({ author: true, comments: true })
   */
  getAll: async (
    options: Partial<Record<string, boolean>> = {
      author: true,
      comments: true,
      categories: true,
      tags: true,
      likes: true,
    },
  ) => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { posts: PostType[] };
    }>(`/posts${query}`);
    return response.data.posts;
  },

  /**
   * Get a single post by ID.
   * @param id Post ID
   * @param options Which relations to include (defaults to all)
   */
  getById: async (
    id: string,
    options: Partial<Record<string, boolean>> = {
      author: true,
      comments: true,
      categories: true,
      tags: true,
      likes: true,
    },
  ): Promise<PostWithRelations> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: PostWithRelations };
    }>(`/posts/id/${id}${query}`);

    if (!response.data?.post) {
      throw new Error("Post not found");
    }

    return response.data.post;
  },

  /**
   * Get a single post by slug.
   * @param slug Post slug
   * @param options Which relations to include (defaults to all)
   */
  getBySlug: async (
    slug: string,
    options: Partial<Record<string, boolean>> = {
      author: true,
      comments: true,
      categories: true,
      tags: true,
      likes: true,
    },
  ): Promise<PostWithRelations> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { post: PostWithRelations };
    }>(`/posts/slug/${slug}${query}`);

    if (!response.data?.post) {
      throw new Error("Post not found");
    }

    return response.data.post;
  },

  /**
   * Get comments of a post.
   */
  getComments: async (id: string) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comments: Comment[] };
    }>(`/posts/${id}/comments`);
    return response.data.comments;
  },

  /**
   * Like a post.
   */
  likePost: (id: string) =>
    apiRequest<void>(`/posts/${id}/like`, { method: "POST" }),

  /**
   * Comment on a post.
   */
  commentOnPost: (id: string, content: string) =>
    apiRequest<Comment>(`/posts/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

export default postApi;
