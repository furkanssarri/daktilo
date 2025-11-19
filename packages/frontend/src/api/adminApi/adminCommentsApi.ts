import { apiRequest } from "../apiClient";
import buildIncludeQuery from "@/utils/buildIncludeQuery";
import type { Comment as CommentType } from "@prisma/client";

/**
 * adminCommentsApi
 * Handles all CRUD operations for comments in the admin context.
 * Uses buildIncludeQuery for optional relation inclusion.
 */
const adminCommentsApi = {
  /**
   * Create a new comment.
   * @param data Comment content and associated postId
   * @param options Optional relations to include (author, post)
   */
  create: async (
    data: { content: string; postId: string },
    options: Partial<Record<string, boolean>> = { author: true, post: true },
  ): Promise<CommentType> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comment: CommentType };
    }>(`/admin/comments${query}`, {
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
  ): Promise<CommentType> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comment: CommentType };
    }>(`/admin/comments/${id}${query}`);
    return response.data.comment;
  },

  /**
   * Get all comments.
   * @param options Optional relations to include (author, post)
   */
  getAll: async (
    options: Partial<Record<string, boolean>> = { author: false, post: false },
  ): Promise<CommentType[]> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comments: CommentType[] };
    }>(`/admin/comments${query}`);
    return response.data.comments;
  },

  /**
   * Update a comment by ID.
   * @param id Comment ID
   * @param data Updated content
   * @param options Optional relations to include (author, post)
   */
  update: async (
    id: string,
    data: { content: string },
    options: Partial<Record<string, boolean>> = { author: true, post: true },
  ): Promise<CommentType> => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comment: CommentType };
    }>(`/admin/comments/${id}${query}`, {
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
    await apiRequest<void>(`/admin/comments/${id}`, { method: "DELETE" });
  },

  /**
   * Approve or disapprove a comment.
   * @param id Comment ID
   * @param approved Boolean value to approve or disapprove
   */
  approveDisapprove: async (
    id: string,
    approved: boolean,
  ): Promise<CommentType> => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comment: CommentType };
    }>(`/admin/comments/${id}/approval`, {
      method: "PUT",
      body: JSON.stringify({ approved }),
    });
    return response.data.comment;
  },
};

export default adminCommentsApi;
