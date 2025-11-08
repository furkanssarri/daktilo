import type { Request, Response } from "express";
import type { ResponseJsonObject } from "../types/response.js";
import type { User } from "@prisma/client";
import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";

type UserUpdateInput = Partial<
  Pick<User, "email" | "password" | "role" | "username" | "avatarId">
>;

// GET api/users/me & GET /api/users/me?include=comments
export const userGetPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const includeComments = req.query.include === "comments";
  if (!req.user)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarId: true,
        createdAt: true,
        ...(includeComments && {
          comments: {
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              isApproved: true,
            },
          },
        }),
      },
    });
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User Profile was not found." });

    res.json({
      status: "success",
      message: "User found.",
      data: { user },
    });
  } catch (err) {
    console.error("Error getting the user profile: ", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};

// PUT api/users/me
export const userPutPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  if (!req.user)
    return res.status(400).json({ status: "error", message: "Bad Request." });
  const updates: UserUpdateInput = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });

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

    res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      data: { updatedUser },
    });
  } catch (err) {
    console.error("Error updating user: ", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};

// PUT api/users/me/password
export const userPasswordPutPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const newPasswordInput: string = req.body;

  if (!req.user)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User Not found." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPasswordInput, salt);

    // TODO: IMPLEMENT VALIDATION & SANITIZATION
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Password was changed successfully.",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    console.error("Error resetting the user's password: ", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};

// GET api/admin/users
export const usersGetByAdmin = async (
  _req: Request,
  res: Response<ResponseJsonObject>,
) => {
  try {
    const users = await prisma.user.findMany();
    if (users.length < 1)
      return res
        .status(404)
        .json({ status: "error", message: "No users found." });
    res.json({
      status: "success",
      message: `${users.length - 1} users found.`,
      data: {
        users,
      },
    });
  } catch (err) {
    console.error("Error retrieving users: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

//PUT api/admin/users/:id
export const userPutByAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { userId } = req.params;
  const updates: UserUpdateInput = req.body;
  if (!userId)
    return res.status(400).json({
      status: "error",
      message: "Please provide a user ID.",
    });
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });

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

    res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error edit user controller: ", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};
