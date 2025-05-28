/*
  Warnings:

  - Changed the type of `potenciaNominal` on the `modulo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tensaoMaxOper` on the `modulo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `correnteMaxOper` on the `modulo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "modulo" DROP COLUMN "potenciaNominal",
ADD COLUMN     "potenciaNominal" DECIMAL(5,2) NOT NULL,
DROP COLUMN "tensaoMaxOper",
ADD COLUMN     "tensaoMaxOper" DECIMAL(5,2) NOT NULL,
DROP COLUMN "correnteMaxOper",
ADD COLUMN     "correnteMaxOper" DECIMAL(5,2) NOT NULL;
