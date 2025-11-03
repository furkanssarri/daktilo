import type { Request, Response } from "express";
import type { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";
import {
  getPublicPostInclude,
  formatPostData,
} from "../utils/postQueryHelper.js";

export const allPostsGetPublic = async (
  _req: Request,
  res: Response<ResponseJsonObject>,
) => {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: getPublicPostInclude(false),
    });
    if (!posts.length)
      return res
        .status(404)
        .json({ status: "error", message: "No posts found." });

    const formattedPosts = posts.map((post) => ({
      ...post,
      likedCount: post._count.likes,
      commentsCount: post._count.comments,
      _count: undefined,
    }));

    res.json({
      status: "success",
      message: "Posts found.",
      data: { posts: formattedPosts },
    });
  } catch (err) {
    console.error("Error getting all posts: ", err);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

export const singlePostBySlugPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { postSlug } = req.params;
  if (!postSlug)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const post = await prisma.post.findFirst({
      where: { slug: postSlug, isPublished: true },
      include: getPublicPostInclude(true),
    });
    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post not found." });

    res.json({
      status: "success",
      message: "Post found.",
      data: {
        post: formatPostData(post),
      },
    });
  } catch (err) {
    console.error("Error getting the post: ", err);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

export const singlePostCommentsPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { postId } = req.params;
  if (!postId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
    const numberOfComments = await prisma.comment.count({ where: { postId } });
    if (!numberOfComments) return res.status(404);

    if (!comments.length)
      return res
        .status(404)
        .json({ status: "error", message: "No comments yet." });

    res.json({
      status: "success",
      message: `Found ${numberOfComments} comments.`,
      data: {
        comments,
      },
    });
  } catch (err) {
    console.error("Error getting the post's comments: ", err);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

export const likePostUser = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const userId = req.user?.id;
  const { postId } = req.params;
  if (!postId || !userId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const post = await prisma.like.create({
      data: {
        authorId: userId,
        postId,
      },
    });

    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "No such post exists." });

    res.json({
      status: "success",
      message: `Like added to the post: ${postId}.`,
      data: {
        post,
      },
    });
  } catch (err) {
    console.error("Error performing like to post: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

export const commentPostUser = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const userId = req.user?.id;
  const { postId } = req.params;
  if (!postId || !userId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const post = await prisma.comment.create({
      data: {
        content: "test",
        postId,
        authorId: userId,
      },
    });

    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post not found." });

    res.json({
      status: "success",
      message: "Comment posted successfully.",
      data: {
        post,
      },
    });
  } catch (err) {
    console.error("Error posting comment to the post: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};
