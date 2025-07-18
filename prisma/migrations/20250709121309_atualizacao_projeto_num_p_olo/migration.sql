/*
  Warnings:

  - You are about to alter the column `disjuntorPadrao` on the `projeto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Integer`.
  - The `numFases` column on the `projeto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `sessaoCondutor` on the `projeto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "projeto" ADD COLUMN     "numeroPoloDisjuntor" INTEGER,
ALTER COLUMN "disjuntorPadrao" SET DEFAULT 1,
ALTER COLUMN "disjuntorPadrao" SET DATA TYPE INTEGER,
DROP COLUMN "numFases",
ADD COLUMN     "numFases" INTEGER DEFAULT 1,
ALTER COLUMN "sessaoCondutor" SET DEFAULT 1,
ALTER COLUMN "sessaoCondutor" SET DATA TYPE INTEGER;
