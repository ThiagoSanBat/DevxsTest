/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Parameter.key_unique";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "publishedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

INSERT INTO "User" (email, name, password, verified, role) VALUES ('test@gmail.com', 'Admin account', '$2a$10$ZCFhfijftMwmflgF.xzYYOua90JF9IforO74wKpBkDN9AAu./MjAu', true, 'ADMIN');