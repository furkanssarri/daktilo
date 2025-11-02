import type { Request, Response } from "express";
import type { ResponseJsonObject } from "../types/response.js";
import type { User } from "@prisma/client";
import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";

type UserUpdateInput = Partial<
  Pick<User, "email" | "password" | "role" | "username" | "avatar">
>;

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

    let updatedData = { ...updates };
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updates.password, salt);
      updatedData.password = hashedPassword;
    }

    // TODO: IMPLEMENT VALIDATION & SANITIZATION
    await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    res.json({
      status: "success",
      message: "User updated successfully.",
      data: updatedData,
    });
  } catch (err) {
    console.error("Error edit user controller: ", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};
