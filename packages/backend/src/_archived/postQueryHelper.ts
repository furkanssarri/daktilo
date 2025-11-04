/**
 * @deprecated
 * This file is archived and no longer used in the project.
 * It is kept here for reference in case we reintroduce a service layer.
 */
import { Prisma } from "@prisma/client";

interface CountedPost {
  _count?: {
    likes: number;
    comments: number;
  };
  authorId?: string;
  isPublished?: boolean;
}

export const getPostInclude = (withComments = false) => {
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
 * Normalizes Prisma post objects by flattening `_count` into `likesCount` and `commentsCount`.
 * Accepts either a single post or an array of posts.
 */
export const formatPostData = <T extends CountedPost>(postOrPosts: T | T[]) => {
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
