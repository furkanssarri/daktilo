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

  // Safely handle cases where query is missing or not an object
  if (typeof query === "object" && query.include) {
    const parts = query.include.split(",").map((s: string) => s.trim());
    if (parts.includes("author")) include.author = true;
    if (parts.includes("comments")) include.comments = true;
    if (parts.includes("category")) include.categories = true;
    if (parts.includes("tags")) include.tags = true;
    if (parts.includes("likes")) include.likes = true;
  }

  if (!admin) {
    where.isPublished = true;
  }

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
