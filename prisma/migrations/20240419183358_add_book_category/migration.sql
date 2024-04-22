/*
  Warnings:

  - Added the required column `category_name` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `books` ADD COLUMN `category_name` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `categories` (
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_category_name_fkey` FOREIGN KEY (`category_name`) REFERENCES `categories`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
