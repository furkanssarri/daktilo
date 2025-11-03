import { Prisma } from "@prisma/client";

export const getPublicPostInclude = (withComments = false) => {
  const baseInclude: Prisma.PostInclude = {
    author: {
      select: { id: true, username: true },
    },
    _count: {
      select: { likes: true, comments: true },
    },
  };

  if (withComments) {
    baseInclude.comments = {
      where: { content: { not: "" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { id: true, username: true },
        },
      },
    };
  }

  return baseInclude;
};

/**
 * Automatically formats Prisma post results to flatten _count fields
 * and remove the nested _count object.
 */
// src/utils/postQueryHelper.ts
export const formatPostData = <
  T extends {
    _count?: { likes: number; comments: number };
    authorId?: string;
    isPublished?: boolean;
  },
>(
  postOrPosts: T | T[],
) => {
  const sanitize = (post: T) => {
    const { _count, authorId, isPublished, ...rest } = post;

    return {
      ...rest,
      likesCount: _count?.likes ?? 0,
      commentsCount: _count?.comments ?? 0,
    };
  };

  return Array.isArray(postOrPosts)
    ? postOrPosts.map(sanitize)
    : sanitize(postOrPosts);
};
