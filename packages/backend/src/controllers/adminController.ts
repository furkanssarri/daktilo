import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";
import type { Post } from "@prisma/client";

type PostUpdateInput = Partial<
  Pick<Post, "title" | "content" | "excerpt" | "slug">
>;

export const createNewPostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  if (!req.user)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const newPost = await prisma.post.create({
      data: {
        title: "test title",
        content: "test content",
        excerpt: "test excerpt",
        slug: "test-slug",
        authorId: req.user.id,
      },
    });

    res.json({
      status: "success",
      message: "Post created successfully.",
      data: {
        newPost,
      },
    });
  } catch (err) {
    console.error("Error creating new post: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

export const updatePostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const updates: PostUpdateInput = req.body;
  const { postId } = req.params;
  if (!postId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const update = { ...updates };

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: update,
    });

    res.json({
      status: "success",
      message: "The post was updated successfully.",
      data: {
        updatedPost,
      },
    });
  } catch (err) {
    console.error("Error updating post: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

export const deletePostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const postId = req.params.id;
  if (!postId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const postToDelete = await prisma.post.delete({ where: { id: postId } });
    if (!postToDelete)
      return res
        .status(404)
        .json({ status: "error", message: "Post not found." });

    res.json({
      status: "success",
      message: "Post deleted successfully.",
      data: {
        postToDelete,
      },
    });
  } catch (err) {
    console.error("Error deleting post: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};
