/*
  Warnings:

  - A unique constraint covering the columns `[title,username]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `books_title_username_key` ON `books`(`title`, `username`);
