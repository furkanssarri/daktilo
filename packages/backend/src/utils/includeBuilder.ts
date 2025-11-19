import { Prisma } from "@prisma/client";

export const buildQueryOptions = (
  query: any = {},
  admin = false,
): {
  include: Prisma.PostInclude;
  where: Prisma.PostWhereInput;
} => {
  const include: Prisma.PostInclude = {};
  const where: Prisma.PostWhereInput = {};

  const includeSet = new Set<string>();

  if (typeof query === "object" && query.include) {
    query.include
      .split(",")
      .map((s: string) => s.trim())
      .forEach((part: string) => includeSet.add(part));
  }

  //  Author inclusion
  if (includeSet.has("author")) {
    include.author = {
      select: { id: true, username: true, avatar: true },
    };
  }

  //  Comments inclusion (now with nested author)
  if (includeSet.has("comments")) {
    include.comments = {
      include: {
        author: { select: { id: true, username: true, avatar: true } },
      },
    };
  }

  // Image inclusion
  if (includeSet.has("image")) {
    include.image = {
      select: { url: true, filename: true, postImage: true },
    };
  }

  //  Deep inclusion support for comments.author
  if (includeSet.has("comments.author")) {
    include.comments = {
      include: {
        author: { select: { id: true, username: true, avatar: true } },
      },
    };
  }

  //  Other relations
  if (includeSet.has("categories")) include.categories = true;
  if (includeSet.has("tags")) include.tags = true;
  if (includeSet.has("likes")) include.likes = true;

  //  Filter unpublished posts for public routes
  if (!admin) where.isPublished = true;

  return { include, where };
};

export const buildUserQuery = (
  query: any = {},
  admin = false,
): {
  include: Prisma.UserInclude;
} => {
  const include: Prisma.UserInclude = {};

  if (typeof query === "object" && query.include) {
    const parts = query.include.split(",").map((s: string) => s.trim());
    if (parts.includes("avatar")) include.avatar = true;
    if (parts.includes("posts")) include.posts = true;
    if (parts.includes("comments")) include.comments = true;
    if (parts.includes("likes")) include.likes = true;
  }

  return { include };
};
