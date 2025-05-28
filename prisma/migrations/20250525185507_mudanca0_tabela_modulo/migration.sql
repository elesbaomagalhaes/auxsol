/*
  Warnings:

  - You are about to drop the column `marca` on the `modulo` table. All the data in the column will be lost.
  - Added the required column `fabricante` to the `modulo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modulo" DROP COLUMN "marca",
ADD COLUMN     "fabricante" TEXT NOT NULL;
