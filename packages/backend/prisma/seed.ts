import { prisma } from "../src/db/prismaClient.js";
import fs from "node:fs";
import path from "node:path";
import { Post, Comment } from "@prisma/client";

const __dirname = path.resolve();

async function main() {
  //await seedPosts();
  //await seedPosts();
  await seedComments();

  console.log("✅ All models have been seeded successfully.");
}

async function seedPosts() {
  const postsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./src/data.json"), "utf-8"),
  ).posts;

  const posts = postsData.map((p: Post) => ({
    ...p,
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: post,
      create: post,
    });
  }
  console.log("✅ Seeded POSTS successfully.");
}

async function seedComments() {
  const commentsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./src/comments.json"), "utf-8"),
  ).comments;

  const comments = commentsData.map((c: Comment) => ({
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  }));

  for (const comment of comments) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: comment,
      create: comment,
    });
  }
  console.log("✅ Seeded COMMENTS successfully.");
}

async function seedCategories() {
  const categories = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./src/categories.json"), "utf-8"),
  ).categories;

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  console.log("✅ Seeded CATEGORIES successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
