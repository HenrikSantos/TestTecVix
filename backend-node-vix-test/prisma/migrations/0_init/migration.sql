-- CreateTable
CREATE TABLE `brandMaster` (
    `idBrandMaster` INTEGER NOT NULL AUTO_INCREMENT,
    `brandName` VARCHAR(191) NULL,
    `isActive` BOOLEAN NULL DEFAULT true,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` DATETIME(0) NULL,
    `brandLogo` VARCHAR(191) NULL,
    `domain` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `emailContact` VARCHAR(191) NULL,
    `fieldName` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `setorName` VARCHAR(191) NULL,
    `smsContact` VARCHAR(191) NULL,
    `timezone` VARCHAR(191) NULL,
    `placeNumber` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `cityCode` INTEGER NULL,
    `district` VARCHAR(191) NULL,
    `stripeUserId` VARCHAR(191) NULL,
    `isPoc` BOOLEAN NULL DEFAULT false,
    `contract` VARCHAR(191) NULL,
    `contractAt` DATETIME(0) NULL,
    `pocOpenedAt` DATETIME(0) NULL,
    `manual` VARCHAR(191) NULL,
    `termsOfUse` VARCHAR(191) NULL,
    `privacyPolicy` VARCHAR(191) NULL,
    `discountRate` DOUBLE NULL,
    `minConsumption` DOUBLE NULL,

    PRIMARY KEY (`idBrandMaster`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vM` (
    `idVM` INTEGER NOT NULL AUTO_INCREMENT,
    `vmName` VARCHAR(191) NULL,
    `vCPU` INTEGER NOT NULL,
    `ram` INTEGER NOT NULL,
    `disk` INTEGER NOT NULL,
    `hasBackup` BOOLEAN NULL DEFAULT false,
    `idBrandMaster` INTEGER NULL,
    `status` ENUM('RUNNING', 'STOPPED', 'PAUSED') NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` DATETIME(0) NULL,
    `os` VARCHAR(191) NULL,
    `pass` VARCHAR(191) NULL,
    `location` ENUM('bre_barueri', 'usa_miami') NULL,

    INDEX `vM_idBrandMaster_fkey`(`idBrandMaster`),
    PRIMARY KEY (`idVM`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `idUser` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `profileImgUrl` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NULL,
    `userPhoneNumber` VARCHAR(191) NULL,
    `role` ENUM('admin', 'manager', 'member') NOT NULL DEFAULT 'member',
    `idBrandMaster` INTEGER NULL,
    `isActive` BOOLEAN NULL DEFAULT true,
    `lastLoginDate` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` DATETIME(0) NULL,
    `field` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `contractDate` DATETIME(0) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_idBrandMaster_fkey`(`idBrandMaster`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vM` ADD CONSTRAINT `vM_idBrandMaster_fkey` FOREIGN KEY (`idBrandMaster`) REFERENCES `brandMaster`(`idBrandMaster`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_idBrandMaster_fkey` FOREIGN KEY (`idBrandMaster`) REFERENCES `brandMaster`(`idBrandMaster`) ON DELETE SET NULL ON UPDATE CASCADE;
