/*
  Warnings:

  - You are about to drop the column `cpf` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `nascimento` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - Made the column `nome_completo` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_cpf_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `cpf`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `nascimento`,
    DROP COLUMN `password`,
    DROP COLUMN `sexo`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `senha` VARCHAR(191) NULL,
    MODIFY `nome_completo` VARCHAR(191) NOT NULL,
    MODIFY `telefone` VARCHAR(191) NOT NULL;
