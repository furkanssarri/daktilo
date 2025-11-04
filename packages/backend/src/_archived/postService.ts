/**
 * @deprecated
 * This file is archived and no longer used in the project.
 * It is kept here for reference in case we reintroduce a service layer.
 */
import prisma from "../db/prismaClient.js";
import { getPostInclude, formatPostData } from "./postQueryHelper.js";

// type FormattedPost =
//   ReturnType<typeof formatPostData> extends (infer U)[] ? U : never;

/**
 * Fetch multiple posts based on user role.
 * - Admin: sees all posts.
 * - Public: sees only published posts.
 */
export const fetchPosts = async (userRole: "admin" | "public") => {
  const whereClause = userRole === "public" ? { isPublished: true } : {};

  const posts = await prisma.post.findMany({
    where: whereClause,
    include: getPostInclude(false),
    orderBy: { createdAt: "desc" },
  });

  // Flatten _count and return clean data
  return formatPostData(posts);
};

/**
 * Fetch a single post by slug based on user role.
 * - Admin: can access any post.
 * - Public: can only access published posts.
 */
export const fetchPostBySlug = async (
  slug: string,
  userRole: "admin" | "public",
) => {
  const whereClause =
    userRole === "public" ? { slug, isPublished: true } : { slug };

  const post = await prisma.post.findUnique({
    where: whereClause,
    include: getPostInclude(true),
  });

  return post ? formatPostData(post) : null;
};

export const fetchPostById = async (
  id: string,
  userRole: "admin" | "public",
) => {
  const whereClause =
    userRole === "public" ? { id, isPublished: true } : { id };

  const post = await prisma.post.findUnique({
    where: whereClause,
    include: getPostInclude(true),
  });

  return post ? formatPostData(post) : null;
};
