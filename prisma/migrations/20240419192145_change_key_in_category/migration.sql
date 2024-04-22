/*
  Warnings:

  - You are about to drop the column `category_name` on the `books` table. All the data in the column will be lost.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `books` DROP FOREIGN KEY `books_category_name_fkey`;

-- AlterTable
ALTER TABLE `books` DROP COLUMN `category_name`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `categories_name_key` ON `categories`(`name`);

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
