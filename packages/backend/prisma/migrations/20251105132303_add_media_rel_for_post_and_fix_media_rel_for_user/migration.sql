/*
  Warnings:

  - You are about to drop the column `uploadedBy` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."media" DROP CONSTRAINT "media_uploadedBy_fkey";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "uploadedBy";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
ADD COLUMN     "avatarId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "posts_imageId_key" ON "posts"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "users_avatarId_key" ON "users"("avatarId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
