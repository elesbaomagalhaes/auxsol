/*
  Warnings:

  - You are about to drop the `Access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_numProjeto_fkey";

-- DropTable
DROP TABLE "Access";

-- DropTable
DROP TABLE "Client";

-- CreateTable
CREATE TABLE "Acesso" (
    "id" TEXT NOT NULL,
    "numProjeto" TEXT NOT NULL,
    "nomeConcessionaria" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "tensaoRede" TEXT NOT NULL,
    "grupoConexao" TEXT NOT NULL,
    "tipoConexao" TEXT NOT NULL,
    "tipoSolicitacao" TEXT NOT NULL,
    "tipoRamal" TEXT NOT NULL,
    "ramoAtividade" TEXT NOT NULL,
    "enquadramentoGeracao" TEXT NOT NULL,
    "tipoGeracao" TEXT NOT NULL,
    "potenciaInstalada" TEXT,
    "fotoMedidor" TEXT,
    "poste" TEXT,
    "longitudeUTM" TEXT NOT NULL,
    "latitudeUTM" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acesso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "rgCnh" TEXT NOT NULL,
    "rgCnhDataEmissao" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "fone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "numProjeto" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acesso_numProjeto_key" ON "Acesso"("numProjeto");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_numProjeto_key" ON "Cliente"("numProjeto");

-- AddForeignKey
ALTER TABLE "Acesso" ADD CONSTRAINT "Acesso_numProjeto_fkey" FOREIGN KEY ("numProjeto") REFERENCES "Cliente"("numProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;
