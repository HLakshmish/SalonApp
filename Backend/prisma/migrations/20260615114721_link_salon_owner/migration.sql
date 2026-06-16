/*
  Warnings:

  - Added the required column `ownerId` to the `Salon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Salon" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
