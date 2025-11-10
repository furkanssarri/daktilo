import type { PostWithRelations } from "@/types/EntityTypes";
import { apiRequest } from "./apiClient";
import buildIncludeQuery from "@/utils/buildIncludeQuery";

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
  ): Promise<PostWithRelations[]> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { posts: PostWithRelations[] };
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
   * Like or unlike (toggle) a post.
   */
  likePost: async (
    id: string,
  ): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { liked: boolean; likeCount: number };
    }>(`/posts/${id}/like`, { method: "POST" });
    return response.data;
  },

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
