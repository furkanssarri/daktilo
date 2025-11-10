import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";
import type { Comment as CommentType } from "@prisma/client";
import sendResponse from "../utils/responseUtil.js";

/**
 * GET /api/comments
 *
 * Retrieves all approved comments.
 * Returns a list of comments with author and post details.
 */
export const getCommentsPublic = async (
  _req: Request,
  res: Response<ResponseJsonObject<{ comments: CommentType[] }>>,
) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { isApproved: true },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
        post: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!comments.length)
      return sendResponse(res, "error", "No comments found.", undefined, 404);

    return sendResponse(res, "success", "Comments retrieved successfully.", {
      comments,
    });
  } catch (err) {
    console.error("Error getting comments:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET /api/comments/:id
 *
 * Retrieves a single approved comment by ID.
 */
export const getCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ comment: CommentType }>>,
) => {
  const { id } = req.params;

  if (!id)
    return sendResponse(res, "error", "Bad request: missing comment ID.");

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        post: { select: { id: true, title: true, slug: true } },
      },
    });

    if (!comment || !comment.isApproved)
      return sendResponse(
        res,
        "error",
        "Comment not found or not approved.",
        undefined,
        404,
      );

    return sendResponse(res, "success", "Comment retrieved successfully.", {
      comment,
    });
  } catch (err) {
    console.error("Error getting comment:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * POST /api/comments
 *
 * Creates a new comment by an authenticated user.
 * The comment must be approved by an admin before becoming visible.
 */
export const createCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ comment: CommentType }>>,
) => {
  const userId = req.user?.id;
  const { content, postId } = req.body;

  if (!userId || !content || !postId)
    return sendResponse(res, "error", "Bad request: missing fields.");

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    return sendResponse(
      res,
      "success",
      "Comment created successfully. Pending admin approval.",
      { comment: newComment },
    );
  } catch (err) {
    console.error("Error creating comment:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT /api/comments/:id
 *
 * Updates a user's own comment and marks it as pending re-approval.
 */
export const updateCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ comment: CommentType }>>,
) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { content } = req.body;

  if (!userId || !id || !content)
    return sendResponse(res, "error", "Bad request: missing fields.");

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment)
      return sendResponse(res, "error", "Comment not found.", undefined, 404);

    if (existingComment.authorId !== userId)
      return sendResponse(res, "error", "Unauthorized action.", undefined, 403);

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content, isApproved: false },
    });

    return sendResponse(
      res,
      "success",
      "Comment updated successfully. Pending admin re-approval.",
      { comment: updatedComment },
    );
  } catch (err) {
    console.error("Error updating comment:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * DELETE /api/comments/:id
 *
 * Deletes a user's own comment.
 */
export const deleteCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ comment: CommentType }>>,
) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId || !id)
    return sendResponse(res, "error", "Bad request: missing fields.");

  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: id },
    });

    if (!existingComment)
      return sendResponse(res, "error", "Comment not found.", undefined, 404);

    if (existingComment.authorId !== userId)
      return sendResponse(res, "error", "Unauthorized action.", undefined, 403);

    const deletedComment = await prisma.comment.delete({ where: { id: id } });

    return sendResponse(res, "success", "Comment deleted successfully.", {
      comment: deletedComment,
    });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};
