-- CreateTable
CREATE TABLE `Administrador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_completo` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Administrador_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
