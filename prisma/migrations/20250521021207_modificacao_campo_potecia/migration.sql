/*
  Warnings:

  - You are about to drop the column `potenciaSaida` on the `protecaoCA` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "protecaoCA" DROP COLUMN "potenciaSaida",
ADD COLUMN     "modelo" TEXT;
