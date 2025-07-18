/*
  Warnings:

  - You are about to drop the column `acessoId` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `inversorId` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `moduloId` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `potenciaGeracao` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeInversore` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeModulo` on the `projeto` table. All the data in the column will be lost.
  - You are about to drop the column `tecnicoId` on the `projeto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clienteCpf]` on the table `acesso` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clienteCpf` to the `acesso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acessoCpf` to the `projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteCpf` to the `projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numProjeto` to the `projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potenciaGerador` to the `projeto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tecnicoCpf` to the `projeto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "acesso" DROP CONSTRAINT "acesso_numProjeto_fkey";

-- DropForeignKey
ALTER TABLE "projeto" DROP CONSTRAINT "projeto_acessoId_fkey";

-- DropForeignKey
ALTER TABLE "projeto" DROP CONSTRAINT "projeto_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "projeto" DROP CONSTRAINT "projeto_inversorId_fkey";

-- DropForeignKey
ALTER TABLE "projeto" DROP CONSTRAINT "projeto_moduloId_fkey";

-- DropForeignKey
ALTER TABLE "projeto" DROP CONSTRAINT "projeto_tecnicoId_fkey";

-- AlterTable
ALTER TABLE "acesso" ADD COLUMN     "clienteCpf" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "kit" ADD COLUMN     "status" TEXT DEFAULT 'a';

-- AlterTable
ALTER TABLE "projeto" DROP COLUMN "acessoId",
DROP COLUMN "clienteId",
DROP COLUMN "inversorId",
DROP COLUMN "moduloId",
DROP COLUMN "potenciaGeracao",
DROP COLUMN "quantidadeInversore",
DROP COLUMN "quantidadeModulo",
DROP COLUMN "tecnicoId",
ADD COLUMN     "acessoCpf" TEXT NOT NULL,
ADD COLUMN     "clienteCpf" TEXT NOT NULL,
ADD COLUMN     "numProjeto" TEXT NOT NULL,
ADD COLUMN     "potenciaGerador" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'a',
ADD COLUMN     "tecnicoCpf" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "acesso_clienteCpf_key" ON "acesso"("clienteCpf");

-- AddForeignKey
ALTER TABLE "acesso" ADD CONSTRAINT "acesso_clienteCpf_fkey" FOREIGN KEY ("clienteCpf") REFERENCES "cliente"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_clienteCpf_fkey" FOREIGN KEY ("clienteCpf") REFERENCES "cliente"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_tecnicoCpf_fkey" FOREIGN KEY ("tecnicoCpf") REFERENCES "tecnico"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_acessoCpf_fkey" FOREIGN KEY ("acessoCpf") REFERENCES "acesso"("clienteCpf") ON DELETE RESTRICT ON UPDATE CASCADE;
