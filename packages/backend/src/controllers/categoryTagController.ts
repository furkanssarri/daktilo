import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";
import sendResponse from "../utils/responseUtil.js";
import type { Category as CategoryType, Tag as TagType } from "@prisma/client";

/**
 * GET /api/categories
 *
 * Retrieves all categories.
 * Returns an array of categories.
 */
export const getCategoriesPublic = async (
  _req: Request,
  res: Response<ResponseJsonObject<{ categories: CategoryType[] }>>,
) => {
  try {
    const categories = await prisma.category.findMany();

    if (!categories.length)
      return sendResponse(res, "error", "No categories found.", undefined, 404);

    return sendResponse(res, "success", "Categories retrieved successfully.", {
      categories,
    });
  } catch (err) {
    console.error("Error getting the categories:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET /api/categories/:id
 *
 * Retrieves a single category by its ID.
 * Returns the category if found.
 */
export const getCategoryPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ category: CategoryType }>>,
) => {
  const { categoryId } = req.params;

  if (!categoryId)
    return sendResponse(res, "error", "Bad request: missing category ID.");

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category)
      return sendResponse(res, "error", "Category not found.", undefined, 404);

    return sendResponse(res, "success", "Category retrieved successfully.", {
      category,
    });
  } catch (err) {
    console.error("Error getting the category:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET /api/categories/:name/posts
 *
 * Retrieves all published posts associated with a specific category.
 * Returns the category with its posts.
 */
export const getPostsByCategoryPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ category: CategoryType }>>,
) => {
  const { categoryName } = req.params;

  if (!categoryName)
    return sendResponse(res, "error", "Bad request: missing category name.");

  try {
    const category = await prisma.category.findUnique({
      where: { name: categoryName },
      include: {
        posts: {
          where: { isPublished: true },
          include: {
            author: {
              select: { id: true, username: true, avatar: true },
            },
            _count: {
              select: { likes: true, comments: true },
            },
          },
        },
      },
    });

    if (!category)
      return sendResponse(
        res,
        "error",
        "Category or posts not found.",
        undefined,
        404,
      );

    return sendResponse(
      res,
      "success",
      "Posts by category retrieved successfully.",
      {
        category,
      },
    );
  } catch (err) {
    console.error("Error getting posts by category:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET /api/tags
 *
 * Retrieves all tags.
 * Returns an array of tags.
 */
export const getTagsPublic = async (
  _req: Request,
  res: Response<ResponseJsonObject<{ tags: TagType[] }>>,
) => {
  try {
    const tags = await prisma.tag.findMany();

    if (!tags.length)
      return sendResponse(res, "error", "No tags found.", undefined, 404);

    return sendResponse(res, "success", "Tags retrieved successfully.", {
      tags,
    });
  } catch (err) {
    console.error("Error getting the tags:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET /api/tags/:id
 *
 * Retrieves a single tag by its ID.
 * Returns the tag if found.
 */
export const getTagPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ tag: TagType }>>,
) => {
  const { tagId } = req.params;

  if (!tagId) return sendResponse(res, "error", "Bad request: missing tag ID.");

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        posts: {
          where: { isPublished: true },
          include: {
            author: true,
            comments: true,
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
    });

    if (!tag)
      return sendResponse(res, "error", "Tag not found.", undefined, 404);

    return sendResponse(res, "success", "Tag retrieved successfully.", { tag });
  } catch (err) {
    console.error("Error getting the tag:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET /api/tags/:name/posts
 *
 * Retrieves all published posts associated with a specific tag.
 * Returns the tag with its posts.
 */
export const getPostsByTagPublic = async (
  req: Request,
  res: Response<ResponseJsonObject<{ tag: TagType }>>,
) => {
  const { tagName } = req.params;

  if (!tagName)
    return sendResponse(res, "error", "Bad request: missing tag name.");

  try {
    const tag = await prisma.tag.findUnique({
      where: { name: tagName },
      include: {
        posts: {
          where: { isPublished: true },
          include: {
            author: {
              select: { id: true, username: true, avatar: true },
            },
            _count: {
              select: { likes: true, comments: true },
            },
          },
        },
      },
    });

    if (!tag)
      return sendResponse(
        res,
        "error",
        "Tag or posts not found.",
        undefined,
        404,
      );

    return sendResponse(
      res,
      "success",
      "Posts by tag retrieved successfully.",
      { tag },
    );
  } catch (err) {
    console.error("Error getting posts by tag:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};
