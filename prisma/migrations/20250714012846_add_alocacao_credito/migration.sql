/*
  Warnings:

  - Added the required column `alocacaoCredito` to the `acesso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "acesso" ADD COLUMN     "alocacaoCredito" TEXT NOT NULL;
