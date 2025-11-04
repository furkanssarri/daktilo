import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";

// api/categories
export const getCategoriesPublic = async (
  _req: Request,
  res: Response<ResponseJsonObject>,
) => {
  try {
    const allCategories = await prisma.category.findMany();
    if (!allCategories)
      return res
        .status(404)
        .json({ status: "error", message: "No category found." });

    res.json({
      status: "success",
      message: "Found categories.",
      data: {
        allCategories,
      },
    });
  } catch (err) {
    console.error("Error getting the categories: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// api/categories/:name
export const getCategoryPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { categoryId } = req.params;
  if (!categoryId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category)
      return res
        .status(404)
        .json({ status: "error", message: "Category not found." });

    res.json({
      status: "success",
      message: "Category found.",
      data: {
        category,
      },
    });
  } catch (err) {
    console.error("Error getting the category: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// api/categories/:name/posts
export const getPostsByCategoryPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { categoryName } = req.params;
  if (!categoryName)
    return res.status(400).json({ status: "error", message: "Bad request." });
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
      return res
        .status(404)
        .json({ status: "error", message: "Posts by category not found." });

    res.json({
      status: "success",
      message: "Posts by category found.",
      data: {
        category,
      },
    });
  } catch (err) {
    console.error("Error getting the posts by category: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// api/tags
export const getTagsPublic = async (
  _req: Request,
  res: Response<ResponseJsonObject>,
) => {
  try {
    const allTags = await prisma.tag.findMany();

    if (!allTags)
      return res
        .status(404)
        .json({ status: "error", message: "Tags not found." });

    res.json({
      status: "success",
      message: "Tags found.",
      data: {
        allTags,
      },
    });
  } catch (err) {
    console.error("Error getting the tags: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// api/tags/:name
export const getTagPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { tagId } = req.params;
  if (!tagId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const tag = await prisma.tag.findUnique({ where: { id: tagId } });

    if (!tag)
      return res
        .status(404)
        .json({ status: "error", message: "Tag not found." });

    res.json({
      status: "success",
      message: "Tag found.",
      data: {
        tag,
      },
    });
  } catch (err) {
    console.error("Error getting the tag: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// api/tags/:name/posts
export const getPostsByTagPublic = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { tagName } = req.params;
  if (!tagName)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    // logic here
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
      return res
        .status(404)
        .json({ status: "error", message: "Post by tag not found." });

    res.json({
      status: "success",
      message: "Post by tag found.",
      data: {
        tag,
      },
    });
  } catch (err) {
    console.error("Error getting the post by tag: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};
