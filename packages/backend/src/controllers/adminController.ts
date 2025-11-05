import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";
import supabase from "../config/supabaseClient.js";
import type { Post } from "@prisma/client";

type PostUpdateInput = Partial<
  Pick<Post, "title" | "content" | "excerpt" | "slug">
>;

// POST api/admin/posts
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

// PUT api/admin/posts/:id
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

// DELETE api/admin/posts/:id
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

// GET api/admin/posts
export const allPostsAdmin = async (
  _req: Request,
  res: Response<ResponseJsonObject>,
) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            username: true,
            avatarId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!Array.isArray(posts) || !posts.length)
      return res
        .status(404)
        .json({ status: "error", message: "No posts found." });

    res.json({
      status: "success",
      message: "Posts fetched successfully.",
      data: { posts },
    });
  } catch (err) {
    console.error("Error getting all posts as an admin: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// GET api/admin/posts/:slug
export const postBySlugAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { postSlug } = req.params;
  if (!postSlug)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      include: {
        author: {
          select: { id: true, email: true, username: true, avatarId: true },
        },
        comments: {
          select: { id: true, content: true, createdAt: true, updatedAt: true },
          include: {
            author: {
              select: { id: true, username: true, avatarId: true },
            },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!post)
      return res
        .status(404)
        .json({ status: "error", message: "Post is not found." });

    res.json({
      status: "success",
      message: "Post found successfully.",
      data: {
        post,
      },
    });
  } catch (err) {
    console.error("Error getting post by slug: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// PUT /api/admin/posts/:id/publish
export const publishUnpublishPostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { postId } = req.params;
  if (!postId)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const postToUpdate = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postToUpdate)
      return res
        .status(404)
        .json({ status: "error", message: "Post not found." });

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        isPublished: postToUpdate.isPublished,
      },
    });

    res.json({
      status: "success",
      message: "Post found successfully.",
      data: { updatedPost },
    });
  } catch (err) {
    console.error("Error publishing post: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// POST api/admin/categories
export const createCategoryAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { name, description } = req.body;
  if (!name)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory)
      return res
        .status(409)
        .json({ status: "error", message: "Category already exists." });

    const newCategory = await prisma.category.create({
      data: { name, description },
    });

    res.json({
      status: "success",
      message: "Category created successfully.",
      data: { newCategory },
    });
  } catch (err) {
    console.error("Error creating category: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// PUT api/admin/categories/:id
export const updateCategoryAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!id || !name)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const duplicate = await prisma.category.findUnique({ where: { name } });

    if (duplicate && duplicate.id !== id)
      return res
        .status(409)
        .json({ status: "error", message: "Category name already in use." });

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category)
      return res
        .status(404)
        .json({ status: "error", message: "Category not found." });

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, description },
    });

    res.json({
      status: "success",
      message: "Category updated successfully.",
      data: { updatedCategory },
    });
  } catch (err) {
    console.error("Error updating category: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// DELETE api/admin/categories/:id
export const deleteCategoryAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const deletedCategory = await prisma.category.delete({ where: { id } });

    res.json({
      status: "success",
      message: "Category deleted successfully.",
      data: { deletedCategory },
    });
  } catch (err: any) {
    console.error("Error deleting category: ", err);
    if (err.code === "P2025")
      return res
        .status(404)
        .json({ status: "error", message: "Category not found." });
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// POST api/admin/tags
export const createTagAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const existingTag = await prisma.tag.findUnique({ where: { name } });
    if (existingTag)
      return res
        .status(409)
        .json({ status: "error", message: "Tag already exists." });

    const newTag = await prisma.tag.create({ data: { name } });

    res.json({
      status: "success",
      message: "Tag created successfully.",
      data: { newTag },
    });
  } catch (err) {
    console.error("Error creating tag: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// PUT api/admin/tags/:id
export const updateTagAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id || !name)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const duplicate = await prisma.tag.findUnique({ where: { name } });
    if (duplicate && duplicate.id !== id)
      return res
        .status(409)
        .json({ status: "error", message: "Tag name already in use." });

    const tag = await prisma.tag.findUnique({ where: { id } });

    if (!tag)
      return res
        .status(404)
        .json({ status: "error", message: "Tag not found." });

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });

    res.json({
      status: "success",
      message: "Tag updated successfully.",
      data: { updatedTag },
    });
  } catch (err) {
    console.error("Error updating tag: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// DELETE api/admin/tags/:id
export const deleteTagAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const deletedTag = await prisma.tag.delete({ where: { id } });

    res.json({
      status: "success",
      message: "Tag deleted successfully.",
      data: { deletedTag },
    });
  } catch (err: any) {
    console.error("Error deleting tag: ", err);
    if (err.code === "P2025")
      return res
        .status(404)
        .json({ status: "error", message: "Tag not found." });
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// PUT api/admin/comments/:id
export const updateCommentAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!id || !content)
    return res.status(400).json({ status: "error", message: "Bad request." });

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found." });

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json({
      status: "success",
      message: "Comment updated successfully by admin.",
      data: { updatedComment },
    });
  } catch (err) {
    console.error("Error updating comment as admin: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// DELETE api/admin/comments/:id
export const deleteCommentAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({ status: "error", message: "Bad request." });

  try {
    const deletedComment = await prisma.comment.delete({ where: { id } });

    res.json({
      status: "success",
      message: "Comment deleted successfully by admin.",
      data: { deletedComment },
    });
  } catch (err: any) {
    console.error("Error deleting comment as admin: ", err);
    if (err.code === "P2025")
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found." });
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};

// PUT api/admin/comments/:id/approval
export const approveDisapproveCommentsAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  if (!id || typeof isApproved !== "boolean")
    return res.status(400).json({ status: "error", message: "Bad request." });

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment)
      return res
        .status(404)
        .json({ status: "error", message: "Comment not found." });

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { isApproved },
    });

    res.json({
      status: "success",
      message: `Comment ${isApproved ? "approved" : "disapproved"} successfully.`,
      data: { updatedComment },
    });
  } catch (err) {
    console.error("Error approving/disapproving comment: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};
// POST api/admin/uplpad
export const uploadPostImageAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject>,
) => {
  const { file } = req;
  if (!file)
    return res.status(400).json({ status: "error", message: "Bad request." });
  try {
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    const storageName = `${Date.now()}_${sanitizedName}`;
    const filePath = `posts/${storageName}`; // <- unique key inside bucket

    // upload to supabase
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading image to the cloud: ", uploadError);
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error." });
    }

    // get public URL
    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    const newMedia = await prisma.media.create({
      data: {
        filename: file.originalname,
        url: publicUrl,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    res.json({
      status: "success",
      message: "Image uploaded successfully.",
      data: { newMedia },
    });
  } catch (err) {
    console.error("Error uploading post image: ", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error." });
  }
};
