/*
  Warnings:

  - You are about to drop the column `usrename` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "usrename",
ADD COLUMN     "username" TEXT;
