/*
  Warnings:

  - You are about to drop the column `closingTime` on the `Salon` table. All the data in the column will be lost.
  - You are about to drop the column `openingTime` on the `Salon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Salon" DROP COLUMN "closingTime",
DROP COLUMN "openingTime",
ADD COLUMN     "operatingHours" JSONB;
