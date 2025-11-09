import type { Request, Response } from "express";
import type { ResponseJsonObject } from "../types/response.js";
import type { User as UserType } from "@prisma/client";
import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/responseUtil.js";
import { buildQueryOptions, buildUserQuery } from "../utils/includeBuilder.js";

type UserUpdateInput = Partial<
  Pick<UserType, "email" | "password" | "role" | "username" | "avatarId">
>;

/**
 * GET api/users/me & GET /api/users/me?include=comments
 * Retrieves the authenticated user's profile with optional related data.
 */
export const userGetPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ user: UserType }>>,
) => {
  if (!req.user)
    return sendResponse(
      res,
      "error",
      "Bad request: unauthorized",
      undefined,
      401,
    );
  try {
    const { include } = buildUserQuery(req.query, false);

    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      include,
    });

    if (!user)
      return sendResponse(
        res,
        "error",
        "User Profile was not found.",
        undefined,
        404,
      );

    return sendResponse(res, "success", "User found.", { user });
  } catch (err) {
    console.error("Error getting the user profile: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/users/me
 * Updates the authenticated user's profile information.
 */
// TODO: REWORK THIS & PASSWORD RESET
export const userPutPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ user: UserType }>>,
) => {
  if (!req.user) return sendResponse(res, "error", "Bad Request.");
  const updates: UserUpdateInput = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user)
      return sendResponse(res, "error", "User not found.", undefined, 404);

    const updatedData = { ...updates };

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updates.password, salt);
      updatedData.password = hashedPassword;
    }

    // TODO: IMPLEMENT VALIDATION & SANITIZATION
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updatedData,
    });

    return sendResponse(res, "success", "User updated successfully.", {
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/users/me/password
 * Updates the authenticated user's password.
 */
export const userPasswordPutPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ user: UserType }>>,
) => {
  const newPasswordInput: string = req.body;

  if (!req.user) return sendResponse(res, "error", "Bad request.");
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user)
      return sendResponse(res, "error", "User Not found.", undefined, 404);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPasswordInput, salt);

    // TODO: IMPLEMENT VALIDATION & SANITIZATION
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
      },
    });

    return sendResponse(res, "success", "Password was changed successfully.", {
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error resetting the user's password: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET api/admin/users
 * Retrieves all users for admin.
 */
export const usersGetByAdmin = async (
  _req: Request,
  res: Response<ResponseJsonObject<{ users: UserType[] }>>,
) => {
  try {
    const users = await prisma.user.findMany();
    if (Array.isArray(users) && !users.length)
      return sendResponse(res, "error", "No users found.", undefined, 404);

    return sendResponse(res, "success", `${users.length} users found.`, {
      users,
    });
  } catch (err) {
    console.error("Error retrieving users: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/admin/users/:id
 * Updates a user's information by admin.
 */
export const userPutByAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ user: UserType }>>,
) => {
  const { userId } = req.params;
  const updates: UserUpdateInput = req.body;
  if (!userId) return sendResponse(res, "error", "Please provide a user ID.");
  if (req.user?.role !== "ADMIN")
    return sendResponse(
      res,
      "error",
      "Bad request: unauthorized.",
      undefined,
      401,
    );
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return sendResponse(res, "error", "User not found.", undefined, 404);

    const updatedData = { ...updates };
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updates.password, salt);
      updatedData.password = hashedPassword;
    }

    // TODO: IMPLEMENT VALIDATION & SANITIZATION
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    return sendResponse(res, "success", "User updated successfully.", {
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error edit user controller: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};
