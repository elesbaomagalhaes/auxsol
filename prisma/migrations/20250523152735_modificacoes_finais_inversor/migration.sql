/*
  Warnings:

  - Changed the type of `fatorPotencia` on the `inversor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `eficiencia` on the `inversor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "inversor" DROP COLUMN "fatorPotencia",
ADD COLUMN     "fatorPotencia" DECIMAL(10,2) NOT NULL,
DROP COLUMN "eficiencia",
ADD COLUMN     "eficiencia" DECIMAL(10,2) NOT NULL;
