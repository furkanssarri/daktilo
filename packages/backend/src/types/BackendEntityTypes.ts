import type { Tag as TagType } from "@prisma/client";

export type PostUpdateRelationsInput = {
  categoryId?: string | null;
  tags?: TagType[]; // array of tag IDs
};
