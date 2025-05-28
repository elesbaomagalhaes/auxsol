/*
  Warnings:

  - You are about to drop the column `quantidade` on the `stringBoxCA` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `stringBoxCC` table. All the data in the column will be lost.
  - Added the required column `classeDps` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correnteMaxDescarga` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correnteMaxOperacao` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correnteNominalDescarga` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivelProtecao` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroEntradas` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroPoloSeccionadora` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroSaidas` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tensaoMaxOperacao` to the `stringBoxCA` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stringBoxCA" DROP COLUMN "quantidade",
ADD COLUMN     "classeDps" TEXT NOT NULL,
ADD COLUMN     "correnteMaxDescarga" TEXT NOT NULL,
ADD COLUMN     "correnteMaxOperacao" TEXT NOT NULL,
ADD COLUMN     "correnteNominalDescarga" TEXT NOT NULL,
ADD COLUMN     "nivelProtecao" TEXT NOT NULL,
ADD COLUMN     "numeroEntradas" INTEGER NOT NULL,
ADD COLUMN     "numeroPoloSeccionadora" INTEGER NOT NULL,
ADD COLUMN     "numeroSaidas" INTEGER NOT NULL,
ADD COLUMN     "tensaoMaxOperacao" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stringBoxCC" DROP COLUMN "quantidade",
ALTER COLUMN "correnteMaxDescarga" SET DATA TYPE TEXT,
ALTER COLUMN "correnteMaxOperacao" SET DATA TYPE TEXT,
ALTER COLUMN "correnteNominalDescarga" SET DATA TYPE TEXT,
ALTER COLUMN "tensaoMaxOperacao" SET DATA TYPE TEXT;
