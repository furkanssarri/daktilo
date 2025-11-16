import type { Request, Response } from "express";
import { ResponseJsonObject } from "../types/response.js";
import prisma from "../db/prismaClient.js";
import supabase from "../config/supabaseClient.js";
import type {
  Post as PostType,
  User as UserType,
  Category as CategoryType,
  Tag as TagType,
  Comment as CommentType,
  Media as MediaType,
} from "@prisma/client";
import { buildQueryOptions } from "../utils/includeBuilder.js";
import sendResponse from "../utils/responseUtil.js";
import generateUniqueSlug from "../utils/generateSlug.js";

type PostUpdateInput = Partial<
  Pick<PostType, "title" | "content" | "excerpt" | "imageId">
>;
/**
 * POST api/admin/posts
 *
 * Accepts: `title: string`, `content: string`,
 * `excerpt?: string`, derived `slug:string` and `authorId: string`.
 * Creates a new Post record with the accepted data.
 * Checks if `user.role` is `ADMIN` for authorization.
 * Returns the created `newMessage:<PostType>`.
 */
export const createNewPostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: PostType }>>,
) => {
  if (!req.user || req.user.role !== "ADMIN")
    return sendResponse(
      res,
      "error",
      "You are not authorized to create posts.",
      undefined,
      401,
    );

  const { title, content, excerpt, imageId } = req.body;

  if (!title || !content)
    return sendResponse(
      res,
      "error",
      "Bad request: All fields are required.",
      undefined,
      400,
    );
  const slugifiedTitle = await generateUniqueSlug(title);
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt ? excerpt : null,
        slug: slugifiedTitle,
        authorId: req.user.id,
      },
    });

    return sendResponse(res, "success", "Post created successfully,", {
      post: newPost,
    });
  } catch (err) {
    console.error("Error creating new post: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/admin/posts/:id
 *
 * Accepts `title?: string`, `content?: string`,
 * excerpt?: string | null`, `imageId?: string | null`
 * updates a post by `slug`.
 * Returns the `updatedPost`.
 */
export const updatePostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: PostType }>>,
) => {
  const updates: PostUpdateInput = req.body;
  const { slug } = req.params;
  if (!slug || !updates)
    return sendResponse(
      res,
      "error",
      "Bad request: post missing parameter: post slug.",
      undefined,
      400,
    );
  try {
    const update = { ...updates };

    const updatedPost = await prisma.post.update({
      where: { slug: slug },
      data: update,
    });

    return sendResponse(res, "success", "Post updated successfully,", {
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error updating post: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};
/**
 * DELETE api/admin/posts/:id
 *
 * Accepts `postID: string`, deletes the post.
 * Returns the `deletedPost`.
 */
export const deletePostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: PostType }>>,
) => {
  const postId = req.params.id;
  if (!postId)
    return sendResponse(
      res,
      "error",
      "Bad request missing parameter: post ID.",
    );
  try {
    const deletedPost = await prisma.post.delete({ where: { id: postId } });
    if (!deletedPost) return sendResponse(res, "error", "Post not found.");

    return sendResponse(res, "success", "Post deleted successfully.", {
      post: deletedPost,
    });
  } catch (err) {
    console.error("Error deleting post: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET api/admin/posts ||
 * GET /api/admin/posts?include=author, comments ||
 * GET /api/admin/posts?include=author,tags,category
 *
 * Fetches all posts for admin. Unlike its sibling,
 * does not filter the post by * `post.isPublished`.
 * Returns all posts.
 */
export const getAllPostsAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ posts: PostType[] }>>,
) => {
  if (!req.user || req.user.role !== "ADMIN")
    return sendResponse(
      res,
      "error",
      "Bad request: You are not authorized for this operation.",
      undefined,
      401,
    );
  try {
    const { include, where } = buildQueryOptions(req.query, true);

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include,
    });

    if (!Array.isArray(posts) || !posts.length)
      return sendResponse(res, "error", "No posts found.", undefined, 404);

    return sendResponse(res, "success", "Posts retrieved successfully.", {
      posts,
    });
  } catch (err) {
    console.error("Error getting all posts as an admin: ", err);
    return sendResponse(res, "error", "Failed to fetch posts,", undefined, 500);
  }
};

/**
 * GET api/admin/posts/id/:id||
 * GET /api/admin/posts/id/:id?include=author, comments ||
 * GET /api/admin/posts/id/:id?include=author,tags,category
 *
 * Fetches all posts for admin by ID. Unlike its sibling,
 * does not filter the post by * `post.isPublished`.
 * Returns all posts.
 */
export const postByIdAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: PostType }>>,
) => {
  const { id } = req.params;
  if (!id)
    return sendResponse(res, "error", "Bad request: missing paramteters.");
  try {
    const { include, where } = buildQueryOptions(req.query, true);

    const post = await prisma.post.findFirst({
      where,
      include,
    });

    if (!post)
      return sendResponse(res, "error", "Post not found.", undefined, 404);

    return sendResponse(res, "success", "Post retrieved successfully.", {
      post,
    });
  } catch (err) {
    console.error("Error getting post by id: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET api/admin/posts/slug/:slug ||
 * GET /api/admin/posts/slug/:slug?include=author, comments ||
 * GET /api/admin/posts/slug/:slug?include=author,tags,category
 *
 * Fetches all posts for admin. Unlike its sibling,
 * does not filter the post by * `post.isPublished`.
 * Returns all posts.
 */
export const postBySlugAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: PostType }>>,
) => {
  const { slug } = req.params;
  if (!slug)
    return sendResponse(res, "error", "Bad request: missing paramteters.");
  try {
    const { include } = buildQueryOptions(req.query, true);

    const post = await prisma.post.findFirst({
      where: { slug: slug },
      include,
    });

    if (!post)
      return sendResponse(res, "error", "Post not found.", undefined, 404);

    return sendResponse(res, "success", "Post retrieved successfully.", {
      post,
    });
  } catch (err) {
    console.error("Error getting post by slug: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT /api/admin/posts/:id/publish
 *
 * Publishes or unpublishes a post by toggling its `isPublished` status.
 * Accepts `postId` as a route parameter.
 * Returns the updated post.
 */
export const publishUnpublishPostAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ post: PostType }>>,
) => {
  const { postId } = req.params;
  if (!postId) return sendResponse(res, "error", "Bad request.");
  try {
    const postToUpdate = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postToUpdate)
      return sendResponse(res, "error", "Post not found.", undefined, 404);

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        isPublished: !postToUpdate.isPublished,
      },
    });

    return sendResponse(
      res,
      "success",
      "Post publish status updated successfully.",
      { post: updatedPost },
    );
  } catch (err) {
    console.error("Error publishing post: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * POST api/admin/categories
 *
 * Creates a new category with the provided name and description.
 * Accepts `name: string` and optional `description: string` in the request body.
 * Returns the created category.
 */
export const createCategoryAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ category: CategoryType }>>,
) => {
  const { name, description } = req.body;
  if (!name)
    return sendResponse(
      res,
      "error",
      "Bad request, `name` field is requiredl.",
    );
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory)
      return sendResponse(
        res,
        "error",
        "Category already exists.",
        undefined,
        409,
      );

    const newCategory = await prisma.category.create({
      data: { name, description },
    });

    return sendResponse(res, "success", "Category created successfully.", {
      category: newCategory,
    });
  } catch (err) {
    console.error("Error creating category: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/admin/categories/:id
 *
 * Updates a category by its ID.
 * Accepts `name: string` and optional `description: string` in the request body.
 * Returns the updated category.
 */
export const updateCategoryAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ category: CategoryType }>>,
) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!id || !name)
    return sendResponse(
      res,
      "error",
      "Bad request, missing parameters: `postId` and/or `name`.",
    );
  try {
    const duplicate = await prisma.category.findUnique({ where: { name } });

    if (duplicate && duplicate.id !== id)
      return sendResponse(
        res,
        "error",
        "Category name already in use.",
        undefined,
        409,
      );

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category)
      return sendResponse(res, "error", "Category not found.", undefined, 404);

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, description },
    });

    return sendResponse(res, "success", "Category updated successfully.", {
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Error updating category: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * DELETE api/admin/categories/:id
 *
 * Deletes a category by its ID.
 * Returns the deleted category.
 */
export const deleteCategoryAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ category: CategoryType }>>,
) => {
  const { id } = req.params;
  if (!id)
    return sendResponse(
      res,
      "error",
      "Bad request, missing parameter: post ID.",
    );
  try {
    const deletedCategory = await prisma.category.delete({ where: { id } });

    return sendResponse(res, "success", "Category deleted successfully.", {
      category: deletedCategory,
    });
  } catch (err: any) {
    console.error("Error deleting category: ", err);
    if (err.code === "P2025")
      return sendResponse(res, "error", "Category not found.", undefined, 404);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * POST api/admin/tags
 *
 * Creates a new tag with the provided name.
 * Accepts `name: string` in the request body.
 * Returns the created tag.
 */
export const createTagAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ tag: TagType }>>,
) => {
  const { name } = req.body;
  if (!name)
    return sendResponse(res, "error", "Bad request, `name` is required.");
  try {
    const existingTag = await prisma.tag.findUnique({ where: { name } });
    if (existingTag)
      return sendResponse(res, "error", "Tag already exists.", undefined, 409);

    const newTag = await prisma.tag.create({ data: { name } });

    return sendResponse(res, "success", "Tag created successfully.", {
      tag: newTag,
    });
  } catch (err) {
    console.error("Error creating tag: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/admin/tags/:id
 *
 * Updates a tag by its ID.
 * Accepts `name: string` in the request body.
 * Returns the updated tag.
 */
export const updateTagAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ tag: TagType }>>,
) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id || !name)
    return sendResponse(res, "error", "Bad request, missing parameters.");
  try {
    const duplicate = await prisma.tag.findUnique({ where: { name } });
    if (duplicate && duplicate.id !== id)
      return sendResponse(
        res,
        "error",
        "Tag name already in use.",
        undefined,
        409,
      );

    const tag = await prisma.tag.findUnique({ where: { id } });

    if (!tag)
      return sendResponse(res, "error", "Tag not found.", undefined, 404);

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });

    return sendResponse(res, "success", "Tag updated successfully.", {
      tag: updatedTag,
    });
  } catch (err) {
    console.error("Error updating tag: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * DELETE api/admin/tags/:id
 *
 * Deletes a tag by its ID.
 * Returns the deleted tag.
 */
export const deleteTagAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ tag: TagType }>>,
) => {
  const { id } = req.params;
  if (!id)
    return sendResponse(
      res,
      "error",
      "Bad request, missing parameter: tag ID.",
    );
  try {
    const deletedTag = await prisma.tag.delete({ where: { id } });

    return sendResponse(res, "success", "Tag deleted successfully.", {
      tag: deletedTag,
    });
  } catch (err: any) {
    console.error("Error deleting tag: ", err);
    if (err.code === "P2025")
      return sendResponse(res, "error", "Tag not found.", undefined, 404);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * GET /api/admin/comments
 *
 * Retrieves all comments, approved and unapproved.
 * Admin-only access.
 */
export const getAllCommentsAdmin = async (
  _req: Request,
  res: Response<ResponseJsonObject<{ comments: CommentType[] }>>,
) => {
  if (_req.user?.role !== "ADMIN")
    return sendResponse(
      res,
      "error",
      "Unauthorized: Admin access required.",
      undefined,
      401,
    );

  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        post: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!comments)
      return sendResponse(
        res,
        "error",
        "No comments to fetch.",
        undefined,
        404,
      );

    return sendResponse(res, "success", "Comments retrieved successfully.", {
      comments,
    });
  } catch (err) {
    console.error("Error getting admin comments:", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/admin/comments/:id
 *
 * Updates a comment's content by its ID.
 * Accepts `content: string` in the request body.
 * Returns the updated comment.
 */
export const updateCommentAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ comment: CommentType }>>,
) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!id || !content)
    return sendResponse(
      res,
      "error",
      "Bad request, missing parameters: comment ID or content.",
    );

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment)
      return sendResponse(res, "error", "Comment not found.", undefined, 404);

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return sendResponse(res, "success", "Comment updated successfully.", {
      comment: updatedComment,
    });
  } catch (err) {
    console.error("Error updating comment as admin: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * DELETE api/admin/comments/:id
 *
 * Deletes a comment by its ID.
 * Returns the deleted comment.
 */
export const deleteCommentAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ comment: CommentType }>>,
) => {
  const { id } = req.params;

  if (!id)
    return sendResponse(
      res,
      "error",
      "Bad request, missing parameter: comment ID.",
    );

  try {
    const deletedComment = await prisma.comment.delete({ where: { id } });

    return sendResponse(
      res,
      "success",
      "Comment deleted successfully by admin.",
      { comment: deletedComment },
    );
  } catch (err: any) {
    console.error("Error deleting comment as admin: ", err);
    if (err.code === "P2025")
      return sendResponse(res, "error", "Comment not found.", undefined, 404);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * PUT api/admin/comments/:id/approval
 *
 * Approves or disapproves a comment by its ID.
 * Accepts `isApproved: boolean` in the request body.
 * Returns the updated comment.
 */
export const approveDisapproveCommentsAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ comment: CommentType }>>,
) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  if (!id || typeof isApproved !== "boolean")
    return sendResponse(
      res,
      "error",
      "Bad request, missing parameter: comment ID.",
    );

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment)
      return sendResponse(res, "error", "Comment not found.", undefined, 404);

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { isApproved },
    });

    return sendResponse(
      res,
      "success",
      `Comment ${isApproved ? "approved" : "disapproved"} successfully.`,
      { comment: updatedComment },
    );
  } catch (err) {
    console.error("Error approving/disapproving comment: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};

/**
 * POST api/admin/upload
 *
 * Uploads a post image to Supabase storage and creates a media record.
 * Accepts a file upload via multipart/form-data.
 * Returns the created media object.
 */
export const uploadPostImageAdmin = async (
  req: Request,
  res: Response<ResponseJsonObject<{ media: MediaType }>>,
) => {
  const { file } = req;
  if (!file)
    return sendResponse(res, "error", "Bad request, no file uploaded.");
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
      return sendResponse(
        res,
        "error",
        "Internal Server Error.",
        undefined,
        500,
      );
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

    return sendResponse(res, "success", "Image uploaded successfully.", {
      media: newMedia,
    });
  } catch (err) {
    console.error("Error uploading post image: ", err);
    return sendResponse(res, "error", "Internal Server Error.", undefined, 500);
  }
};
