/*
  Warnings:

  - Added the required column `customerAddress` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerCity` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerEmail` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerGender` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "customerAddress" TEXT NOT NULL,
ADD COLUMN     "customerCity" TEXT NOT NULL,
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerGender" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL;
