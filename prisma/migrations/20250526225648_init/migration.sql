/*
  Warnings:

  - You are about to drop the `Paper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sota` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TopicPaper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Sota` DROP FOREIGN KEY `Sota_topicId_fkey`;

-- DropForeignKey
ALTER TABLE `Topic` DROP FOREIGN KEY `Topic_userId_fkey`;

-- DropForeignKey
ALTER TABLE `TopicPaper` DROP FOREIGN KEY `TopicPaper_paperId_fkey`;

-- DropForeignKey
ALTER TABLE `TopicPaper` DROP FOREIGN KEY `TopicPaper_topicId_fkey`;

-- DropTable
DROP TABLE `Paper`;

-- DropTable
DROP TABLE `Sota`;

-- DropTable
DROP TABLE `Topic`;

-- DropTable
DROP TABLE `TopicPaper`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `papers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `doi` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `ruta` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `papers_doi_key`(`doi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sotas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruta` VARCHAR(191) NOT NULL,
    `topic_id` INTEGER NOT NULL,
    `version` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topic_paper` (
    `topic_id` INTEGER NOT NULL,
    `paper_id` INTEGER NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `ruta_db` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`topic_id`, `paper_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `topics` ADD CONSTRAINT `topics_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sotas` ADD CONSTRAINT `sotas_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topic_paper` ADD CONSTRAINT `topic_paper_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topic_paper` ADD CONSTRAINT `topic_paper_paper_id_fkey` FOREIGN KEY (`paper_id`) REFERENCES `papers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
