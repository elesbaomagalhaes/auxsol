/*
  Warnings:

  - You are about to drop the column `curvaAtuDisjuntor` on the `protecaoCA` table. All the data in the column will be lost.
  - Added the required column `curvaDisjuntor` to the `protecaoCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tensaoMaxDPS` to the `protecaoCA` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "protecaoCA" DROP COLUMN "curvaAtuDisjuntor",
ADD COLUMN     "curvaDisjuntor" TEXT NOT NULL,
ADD COLUMN     "tensaoMaxDPS" TEXT NOT NULL;
