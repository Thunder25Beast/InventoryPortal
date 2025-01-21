/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inventory_title_key" ON "Inventory"("title");
