import type { Prisma } from "@prisma/client";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: { comments: true; author: true };
}>;
