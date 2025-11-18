import type { Tag as TagType } from "@prisma/client";

export type PostUpdateRelationsInput = {
  imageId?: string | null;
  categoryId?: string | null;
  tags?: TagType[]; // array of tag IDs
};
