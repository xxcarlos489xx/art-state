/*
  Warnings:

  - Added the required column `slug` to the `topics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `topics` ADD COLUMN `slug` VARCHAR(191) NOT NULL;
