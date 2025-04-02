/*
  Warnings:

  - A unique constraint covering the columns `[documentId]` on the table `energy_bill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `energy_bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "energy_bill" ADD COLUMN     "documentId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "energy_bill_documentId_key" ON "energy_bill"("documentId");

-- AddForeignKey
ALTER TABLE "energy_bill" ADD CONSTRAINT "energy_bill_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
