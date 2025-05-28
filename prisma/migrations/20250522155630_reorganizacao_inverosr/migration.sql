/*
  Warnings:

  - You are about to drop the column `correnteNominalSai` on the `inversor` table. All the data in the column will be lost.
  - You are about to drop the column `frequenciaNominal` on the `inversor` table. All the data in the column will be lost.
  - You are about to drop the column `potenciaNominalEnt` on the `inversor` table. All the data in the column will be lost.
  - You are about to drop the column `potenciaNominalSai` on the `inversor` table. All the data in the column will be lost.
  - You are about to drop the column `tensaoInicializacao` on the `inversor` table. All the data in the column will be lost.
  - You are about to drop the column `tensaoNominalEnt` on the `inversor` table. All the data in the column will be lost.
  - You are about to drop the column `tensaoNominalSai` on the `inversor` table. All the data in the column will be lost.
  - Added the required column `correnteNomSai` to the `inversor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequenciaNom` to the `inversor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potenciaNomEnt` to the `inversor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potenciaNomSai` to the `inversor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tensaoInic` to the `inversor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tensaoNomEnt` to the `inversor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tensaoNomSai` to the `inversor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inversor" DROP COLUMN "correnteNominalSai",
DROP COLUMN "frequenciaNominal",
DROP COLUMN "potenciaNominalEnt",
DROP COLUMN "potenciaNominalSai",
DROP COLUMN "tensaoInicializacao",
DROP COLUMN "tensaoNominalEnt",
DROP COLUMN "tensaoNominalSai",
ADD COLUMN     "correnteNomSai" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "frequenciaNom" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "potenciaNomEnt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "potenciaNomSai" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tensaoInic" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tensaoNomEnt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tensaoNomSai" DECIMAL(10,2) NOT NULL;
