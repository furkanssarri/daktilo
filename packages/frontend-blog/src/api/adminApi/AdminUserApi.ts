import { apiRequest } from "@/api/apiClient";
import buildIncludeQuery from "@/utils/buildIncludeQuery.js";
import type { User } from "@prisma/client";
import type { UserWithRelations } from "@/types/EntityTypes";

const adminUserApi = {
  /**
   * Get all users with optional relations.
   */
  getAllUsers: async (
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
      data: { users: UserWithRelations[] };
    }>(`/admin/users${query}`);
    return response.data.users;
  },

  /**
   * Get a user by ID with optional relations.
   */
  getUserById: async (
    id: string,
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
    }>(`/admin/users/${id}${query}`);
    return response.data.user;
  },

  /**
   * Update a user by ID.
   */
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: { user: User };
    }>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data.user;
  },

  /**
   * Delete a user by ID.
   */
  deleteUser: async (id: string) =>
    apiRequest<void>(`/admin/users/${id}`, { method: "DELETE" }),
};

export default adminUserApi;
