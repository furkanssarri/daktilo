import type { Request, Response } from "express";
import type { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";
import { Post } from "@prisma/client";
import { buildQueryOptions } from "../utils/includeBuilder.js";
import sendResponse from "../utils/responseUtil.js";

/**
 * GET /api/posts
 * GET /api/posts?include=author,comments,category
 * Returns all published posts (optionally with relations).
 */
export const allPostsGetPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ posts: Post[] }>>,
) => {
  try {
    const { include, where } = buildQueryOptions(req.query, false);
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include,
    });

    if (Array.isArray(posts) && !posts.length)
      return sendResponse(res, "error", "No posts found.", undefined, 404);

    sendResponse(res, "success", "Posts retrieved successfully.", { posts });
  } catch (err) {
    console.error("Error getting all posts: ", err);
    return sendResponse(res, "error", "Failed to fetch posts.", undefined, 500);
  }
};
/**
 * GET api/post/slug/:slug
 * GET /api/post/:slug?include=author,comments,category
 * Returns a single published post by slug.
 */
export const singlePostBySlugPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: Post }>>,
) => {
  const { slug } = req.params;
  if (!slug)
    return sendResponse(res, "error", "Bad request, missing post slug.");
  try {
    const { include, where } = buildQueryOptions(req.query, false);

    const post = await prisma.post.findFirst({
      where,
      include,
    });

    if (!post)
      return sendResponse(res, "error", "Post not found.", undefined, 404);

    return sendResponse(
      res,
      "success",
      "Post retrieved successfully.",
      { post },
      200,
    );
  } catch (err) {
    console.error("Error getting the post: ", err);
    return sendResponse(res, "error", "Failed to fetch posts.", undefined, 500);
  }
};

/**
 * GET api/post/id/:id
 * GET /api/post/:id?include=author,comments,category
 * Returns a single published post by ID.
 */
export const singlePostByIdPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: Post }>>,
) => {
  const { id } = req.params;
  if (!id) return sendResponse(res, "error", "Bad request, ID is missing.");

  try {
    const { include, where } = buildQueryOptions(req.query, false);

    const post = await prisma.post.findFirst({
      where,
      include,
    });

    if (!post)
      return sendResponse(res, "error", "Post not found.", undefined, 404);

    sendResponse(res, "success", "Post retrieved successfully.", { post }, 200);
  } catch (err) {
    console.error("Error getting the post: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * POST api/posts/:id/like
 * Creates a Like record for the post by `id` with `userId`
 * Returns the `updatedPost` post.
 */
export const likePostUser = async (
  req: Request,
  res: Response<ResponseJsonObject<{ liked: boolean; likeCount: number }>>,
) => {
  const userId = req.user?.id;
  const { id: postId } = req.params;
  if (!postId || !userId)
    return sendResponse(
      res,
      "error",
      "Bad Request, post ID or user ID missing.",
    );
  console.log("user id: ", userId, "post id: ", postId);
  try {
    const existingLike = await prisma.like.findFirst({
      where: { authorId: userId, postId: postId },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      const likeCount = await prisma.like.count({ where: { postId } });
      return sendResponse(res, "success", "Post unliked successfully.", {
        liked: false,
        likeCount,
      });
    } else {
      await prisma.like.create({
        data: { authorId: userId, postId: postId },
      });
      const likeCount = await prisma.like.count({ where: { postId } });
      return sendResponse(res, "success", "Post liked successfully.", {
        liked: true,
        likeCount,
      });
    }
  } catch (err) {
    console.error("Error performing like to post: ", err);
    return sendResponse(res, "error", "Internal Server Error", undefined, 500);
  }
};
/**
 * POST api/posts/:id/comment
 * Creates a Comment record for the post by `id` with `userId` and `content`.
 * Returns the `updatedPost` post.
 */
export const commentPostUser = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: Post }>>,
) => {
  const userId = req.user?.id;
  const { postId } = req.params;
  const { content } = req.body;
  if (!postId || !userId)
    return sendResponse(
      res,
      "error",
      "Bad Request, post ID or user ID missing.",
    );

  try {
    const comment = await prisma.comment.create({
      data: {
        content: content,
        postId: postId,
        authorId: userId,
      },
    });

    if (!comment)
      return sendResponse(
        res,
        "error",
        "Failed to comment to the post.",
        undefined,
        404,
      );

    const updatedPost = await prisma.post.findFirst({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
        comments: {
          select: {
            content: true,
            createdAt: true,
            updatedAt: true,
          },
          include: {
            author: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!updatedPost)
      return sendResponse(
        res,
        "error",
        "Failed to comment to the post, the post was not found.",
        undefined,
        404,
      );

    return sendResponse(
      res,
      "success",
      "Comment added to the post successfully.",
      { post: updatedPost },
      200,
    );
  } catch (err) {
    console.error("Error posting comment to the post: ", err);
    return sendResponse(res, "error", "Internal Server Error", undefined, 500);
  }
};
