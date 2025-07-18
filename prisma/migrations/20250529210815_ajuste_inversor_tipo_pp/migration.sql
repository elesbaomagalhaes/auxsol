/*
  Warnings:

  - You are about to drop the column `typeInv` on the `inversor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inversor" DROP COLUMN "typeInv",
ADD COLUMN     "tipoInv" TEXT;
