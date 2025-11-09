import type { Comment as CommentType, Prisma } from "@prisma/client";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: { comments: true; author: true };
}>;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { posts: true; comments: true; avatar: true };
}>;

export type FrontendComment = CommentType & {
  author?: { id: string; username: string; avatar: string | null };
};
