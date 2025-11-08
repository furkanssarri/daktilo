import slug from "slug";
import prisma from "../db/prismaClient.js";

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slug(title, { locale: "tr" });

  const existingSlugs = await prisma.post.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });

  let counter = 1;
  let uniqueSlug = baseSlug;
  const slugSet = new Set(existingSlugs.map((p) => p.slug));

  while (slugSet.has(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export default generateUniqueSlug;
