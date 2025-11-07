import type { Request, Response } from "express";
import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { ResponseJsonObject } from "../types/response.js";
import jwt from "jsonwebtoken";

interface SignupRequestBody {
  email: string;
  password: string;
  username: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const signup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response<ResponseJsonObject>,
) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({
      status: "error",
      message: "All fields must be filled out.",
    });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser)
      return res.status(409).json({
        status: "error",
        message: "User already exists.",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedpassword,
        username,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Account successfully created.",
      data: {
        newUser,
      },
    });
  } catch (err) {
    console.error("Error signing up: ", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<ResponseJsonObject>,
) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials.",
      });

    const { accessToken, refreshToken } = generateToken(user.id, user.email);

    return res.json({
      status: "success",
      message: "Login successful",
      data: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error("Error in login controller: ", err);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
// backend/src/controllers/authController.ts
export const refreshToken = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { refreshToken } = req.body;
  const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET!;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ status: "error", message: "No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret) as {
      id: string;
      email: string;
    };
    const newTokens = generateToken(decoded.id, decoded.email);

    res.json({
      status: "success",
      message: "Token refreshed successfully.",
      data: newTokens,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    res
      .status(401)
      .json({ status: "error", message: "Invalid or expired refresh token." });
  }
};
