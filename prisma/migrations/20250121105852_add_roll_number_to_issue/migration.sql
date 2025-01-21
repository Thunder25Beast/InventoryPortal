/*
  Warnings:

  - You are about to drop the column `userId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rollNumber` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_userId_fkey";

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "img" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "userId",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "rollNumber" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE INDEX "Issue_inventoryId_idx" ON "Issue"("inventoryId");
