-- DropForeignKey
ALTER TABLE "Salon" DROP CONSTRAINT "Salon_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
