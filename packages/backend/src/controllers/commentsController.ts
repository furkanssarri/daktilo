import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";

// GET api/comments
export const getCommentsPublic = async (
  _req: Request,
  res: Response<ResponseJsonObject>,
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
      return res
        .status(404)
        .json({ status: "error", message: "No comments found." });

    res.json({
      status: "success",
      message: "Comments found.",
      data: { comments },
    });
  } catch (err) {
    console.error("Error getting comments: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// GET api/comments/:id
export const getCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: "error", message: "Bad request." });

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        post: { select: { id: true, title: true, slug: true } },
      },
    });

    if (!comment || !comment.isApproved)
      return res.status(404).json({
        status: "error",
        message: "Comment not found or not approved.",
      });

    res.json({
      status: "success",
      message: "Comment found.",
      data: { comment },
    });
  } catch (err) {
    console.error("Error getting comment: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// POST api/comments
export const createCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const userId = req.user?.id;
  const { content, postId } = req.body;

  if (!userId || !content || !postId)
    return res.status(400).json({ status: "error", message: "Bad request." });

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });

    res.json({
      status: "success",
      message: "Comment created successfully. Pending admin approval.",
      data: { newComment },
    });
  } catch (err) {
    console.error("Error creating comment: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// PUT api/comments/:id
export const updateCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { content } = req.body;

  if (!userId || !id || !content)
    return res.status(400).json({ status: "error", message: "Bad request." });

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found." });

    if (existingComment.authorId !== userId)
      return res
        .status(403)
        .json({ status: "error", message: "Unauthorized action." });

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content, isApproved: false },
    });

    res.json({
      status: "success",
      message: "Comment updated successfully. Pending admin re-approval.",
      data: { updatedComment },
    });
  } catch (err) {
    console.error("Error updating comment: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// DELETE api/comments/:id
export const deleteCommentPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId || !id)
    return res.status(400).json({ status: "error", message: "Bad request." });

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found." });

    if (existingComment.authorId !== userId)
      return res
        .status(403)
        .json({ status: "error", message: "Unauthorized action." });

    const deletedComment = await prisma.comment.delete({ where: { id } });

    res.json({
      status: "success",
      message: "Comment deleted successfully.",
      data: { deletedComment },
    });
  } catch (err) {
    console.error("Error deleting comment: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};
