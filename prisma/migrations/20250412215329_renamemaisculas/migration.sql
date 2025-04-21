/*
  Warnings:

  - You are about to drop the `Acesso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inversor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Modulo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Acesso" DROP CONSTRAINT "Acesso_numProjeto_fkey";

-- DropTable
DROP TABLE "Acesso";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Inversor";

-- DropTable
DROP TABLE "Modulo";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "acesso" (
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

    CONSTRAINT "acesso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
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

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL DEFAULT 'int',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulo" (
    "id" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "potenciaNominal" TEXT NOT NULL,
    "tensaoCircAberto" TEXT NOT NULL,
    "correnteCurtCirc" TEXT NOT NULL,
    "tensaoMaxOper" TEXT NOT NULL,
    "correnteMaxOper" TEXT NOT NULL,
    "eficiencia" TEXT NOT NULL,
    "datasheet" TEXT NOT NULL,
    "seloInmetro" TEXT,
    "comprimento" DECIMAL(5,2) NOT NULL,
    "largura" DECIMAL(5,2) NOT NULL,
    "area" DECIMAL(5,2) NOT NULL,
    "peso" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inversor" (
    "id" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "potenciaNominalEnt" DECIMAL(10,2) NOT NULL,
    "potenciaMaxEnt" DECIMAL(10,2) NOT NULL,
    "tensaoMaxEnt" DECIMAL(10,2) NOT NULL,
    "tensaoInicializacao" DECIMAL(10,2) NOT NULL,
    "tensaoNominalEnt" DECIMAL(10,2) NOT NULL,
    "numeroEntMPPT" INTEGER NOT NULL,
    "potenciaMaxMPPT" DECIMAL(10,2) NOT NULL,
    "correnteMaxEnt" DECIMAL(10,2) NOT NULL,
    "correnteMaxCurtCirc" DECIMAL(10,2) NOT NULL,
    "potenciaNominalSai" DECIMAL(10,2) NOT NULL,
    "potenciaMaxSai" DECIMAL(10,2) NOT NULL,
    "correnteNominalSai" DECIMAL(10,2) NOT NULL,
    "correnteMaxSai" DECIMAL(10,2) NOT NULL,
    "tensaoNominalSai" DECIMAL(10,2) NOT NULL,
    "THD" DECIMAL(10,2) NOT NULL,
    "frequenciaNominal" DECIMAL(10,2) NOT NULL,
    "fatorPotencia" DECIMAL(10,2) NOT NULL,
    "tensaoMaxsSai" DECIMAL(10,2) NOT NULL,
    "tensaoMinSai" DECIMAL(10,2) NOT NULL,
    "eficiencia" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inversor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acesso_numProjeto_key" ON "acesso"("numProjeto");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_cpf_key" ON "cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_numProjeto_key" ON "cliente"("numProjeto");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "acesso" ADD CONSTRAINT "acesso_numProjeto_fkey" FOREIGN KEY ("numProjeto") REFERENCES "cliente"("numProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;
