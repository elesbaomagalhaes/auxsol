/*
  Warnings:

  - Added the required column `classeDps` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correnteMaxDescarga` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correnteMaxOperacao` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correnteNominalDescarga` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grauProtecao` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivelProtecao` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroEntradas` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroPoloSeccionadora` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroSaidas` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tensaoMaxOperacao` to the `stringBoxCC` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stringBoxCC" ADD COLUMN     "classeDps" TEXT NOT NULL,
ADD COLUMN     "correnteMaxDescarga" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "correnteMaxOperacao" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "correnteNominalDescarga" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "grauProtecao" TEXT NOT NULL,
ADD COLUMN     "nivelProtecao" TEXT NOT NULL,
ADD COLUMN     "numeroEntradas" INTEGER NOT NULL,
ADD COLUMN     "numeroPoloSeccionadora" INTEGER NOT NULL,
ADD COLUMN     "numeroSaidas" INTEGER NOT NULL,
ADD COLUMN     "tensaoMaxOperacao" DECIMAL(10,2) NOT NULL;
