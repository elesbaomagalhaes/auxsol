/*
  Warnings:

  - You are about to alter the column `string` on the `kit` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(5,0)`.

*/
-- AlterTable
ALTER TABLE "kit" ALTER COLUMN "string" SET DATA TYPE DECIMAL(5,0);
