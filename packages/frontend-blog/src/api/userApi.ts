import { apiRequest } from "./apiClient";
import buildIncludeQuery from "@/utils/queryBuilder.js";
import type { User, Comment } from "@prisma/client";
import type { UserWithRelations } from "@/types/EntityTypes";

const userApi = {
  /**
   * Get current authenticated user's profile.
   * @param options Optional relations to include (posts, comments, avatar)
   */
  getMe: async (
    options: Partial<Record<string, boolean>> = {
      posts: true,
      comments: true,
      avatar: true,
    },
  ) => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { user: UserWithRelations };
    }>(`/users/me${query}`);

    return response.data.user;
  },

  /**
   * Get all comments made by the authenticated user.
   * @param options Optional relations to include (post, author)
   */
  getComments: async (
    options: Partial<Record<string, boolean>> = { post: true },
  ) => {
    const query = buildIncludeQuery(options);
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { comments: Comment[] };
    }>(`/users/me/comments${query}`);

    return response.data.comments;
  },

  /**
   * Update the authenticated user's profile.
   */
  updateMe: async (data: Partial<User>) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { user: User };
    }>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return response.data.user;
  },

  /**
   * Change the authenticated user's password.
   */
  changePassword: async (data: { oldPassword: string; newPassword: string }) =>
    apiRequest<void>("/users/me/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export default userApi;
