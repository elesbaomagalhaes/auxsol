-- CreateTable
CREATE TABLE "Access" (
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

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
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

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
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

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inversor" (
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

    CONSTRAINT "Inversor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Access_numProjeto_key" ON "Access"("numProjeto");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Client_numProjeto_key" ON "Client"("numProjeto");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_numProjeto_fkey" FOREIGN KEY ("numProjeto") REFERENCES "Client"("numProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;
