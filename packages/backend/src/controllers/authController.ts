import type { Request, Response } from "express";
import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { ResponseJsonObject } from "../types/response.js";
import jwt from "jsonwebtoken";
import sendResponse from "../utils/responseUtil.js";
import type { User as UserType } from "@prisma/client";

/**
 * Register a new user
 * Route: POST /api/auth/signup
 *
 * Request body: { email: string, password: string, username: string }
 * Response: 201 + { user: User } on success
 *
 * Notes:
 * - Password is hashed with bcrypt before storing.
 * - Returns 400 for missing fields, 409 for existing user, 500 for server errors.
 */
export const signup = async (
  req: Request<{}, {}, { email: string; password: string; username: string }>,
  res: Response<ResponseJsonObject<{ user: UserType }>>,
) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return sendResponse(res, "error", "All fields must be filled out.");
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return sendResponse(res, "error", "User already exists.", undefined, 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return sendResponse(
      res,
      "success",
      "Account successfully created.",
      { user: newUser },
      201,
    );
  } catch (err) {
    console.error("Error signing up:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * Authenticate user and issue tokens
 * Route: POST /api/auth/login
 *
 * Request body: { email: string, password: string }
 * Response: 200 + { accessToken: string, refreshToken: string } on success
 *
 * Notes:
 * - 404 if user not found.
 * - 401 if password mismatch.
 * - 500 on server error.
 */
export const loginUser = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<
    ResponseJsonObject<{ accessToken: string; refreshToken: string }>
  >,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, "error", "Email and password are required.");
  }

  try {
    const user: UserType | null = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendResponse(res, "error", "User not found.", undefined, 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, "error", "Invalid credentials.", undefined, 401);
    }

    const { accessToken, refreshToken } = generateToken(user.id, user.email);

    return sendResponse(
      res,
      "success",
      "Login successful.",
      { accessToken, refreshToken },
      200,
    );
  } catch (err) {
    console.error("Error in login controller:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * Refresh access & refresh tokens
 * Route: POST /api/auth/refresh-token
 *
 * Request body: { refreshToken: string }
 * Response: 200 + { accessToken: string, refreshToken: string } on success
 *
 * Notes:
 * - Verifies refresh token using JWT_REFRESH_TOKEN_SECRET.
 * - Returns 400 if no token provided, 401 if invalid/expired, 500 on server error.
 */
export const refreshToken = async (
  req: Request<{}, {}, { refreshToken?: string }>,
  res: Response<
    ResponseJsonObject<{ accessToken: string; refreshToken: string }>
  >,
) => {
  const { refreshToken } = req.body;
  const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

  if (!refreshToken) {
    return sendResponse(res, "error", "No refresh token provided.");
  }

  if (!refreshSecret) {
    console.error("Missing JWT_REFRESH_TOKEN_SECRET env var");
    return sendResponse(
      res,
      "error",
      "Server configuration error.",
      undefined,
      500,
    );
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret) as {
      id: string;
      email: string;
    };

    if (!decoded || !decoded.id || !decoded.email) {
      return sendResponse(
        res,
        "error",
        "Invalid refresh token payload.",
        undefined,
        401,
      );
    }

    const newTokens = generateToken(decoded.id, decoded.email);

    return sendResponse(
      res,
      "success",
      "Token refreshed successfully.",
      newTokens,
    );
  } catch (err) {
    console.error("Error refreshing token:", err);
    return sendResponse(
      res,
      "error",
      "Invalid or expired refresh token.",
      undefined,
      401,
    );
  }
};
