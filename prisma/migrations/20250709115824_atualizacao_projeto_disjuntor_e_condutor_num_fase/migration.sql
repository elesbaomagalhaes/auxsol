/*
  Warnings:

  - You are about to drop the column `hsp` on the `projeto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projeto" DROP COLUMN "hsp",
ADD COLUMN     "disjuntorPadrao" DECIMAL(4,2),
ADD COLUMN     "numFases" TEXT,
ADD COLUMN     "sessaoCondutor" DECIMAL(4,2);
