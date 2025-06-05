/*
  Warnings:

  - A unique constraint covering the columns `[doi,user_id]` on the table `papers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `papers_doi_key` ON `papers`;

-- CreateIndex
CREATE UNIQUE INDEX `papers_doi_user_id_key` ON `papers`(`doi`, `user_id`);
