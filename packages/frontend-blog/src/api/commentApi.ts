import { apiRequest } from "./apiClient";
import buildIncludeQuery from "@/utils/buildIncludeQuery";
import type { FrontendComment } from "@/types/EntityTypes";

/**
 * commentApi
 * Handles all CRUD operations for comments.
 * Uses buildIncludeQuery for optional relation inclusion.
 */
const commentApi = {
  /**
   * Create a new comment.
   * @param data Comment content and associated postId
   * @param options Optional relations to include (author, post)
   */
  create: async (
    data: { content: string; postId: string },
    options: Partial<Record<string, boolean>> = { author: true, post: true },
  ): Promise<FrontendComment> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comment: FrontendComment };
    }>(`/comments${query}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return response.data.comment;
  },

  /**
   * Get a comment by ID.
   * @param id Comment ID
   * @param options Optional relations to include (author, post)
   */
  getById: async (
    id: string,
    options: Partial<Record<string, boolean>> = { author: true, post: true },
  ): Promise<FrontendComment> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comment: FrontendComment };
    }>(`/comments/${id}${query}`);

    return response.data.comment;
  },

  /**
   * Get all comments.
   * (For admin or moderation dashboards)
   * @param options Optional relations to include (author, post)
   */
  getAll: async (
    options: Partial<Record<string, boolean>> = { author: true, post: true },
  ): Promise<FrontendComment[]> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comments: FrontendComment[] };
    }>(`/comments${query}`);

    return response.data.comments;
  },

  /**
   * Update an existing comment.
   * @param id Comment ID
   * @param data Updated content
   * @param options Optional relations to include (author, post)
   */
  update: async (
    id: string,
    data: { content: string },
    options: Partial<Record<string, boolean>> = { author: true },
  ): Promise<FrontendComment> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comment: FrontendComment };
    }>(`/comments/${id}${query}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return response.data.comment;
  },

  /**
   * Delete a comment by ID.
   * @param id Comment ID
   */
  delete: async (id: string): Promise<void> => {
    await apiRequest<void>(`/comments/${id}`, { method: "DELETE" });
  },
};

export default commentApi;
