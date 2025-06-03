/*
  Warnings:

  - Made the column `doi` on table `papers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `papers` MODIFY `doi` VARCHAR(191) NOT NULL;
