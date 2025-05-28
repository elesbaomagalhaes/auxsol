-- AlterTable
ALTER TABLE "acesso" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "cliente" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "inversor" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "modulo" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "tecnico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "registro" TEXT NOT NULL,
    "rgCnh" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "fone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipoProfissional" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "tecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stringBoxCC" (
    "id" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "stringBoxCC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stringBoxCA" (
    "id" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "stringBoxCA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto" (
    "id" TEXT NOT NULL,
    "potenciaGeracao" DECIMAL(10,2) NOT NULL,
    "potenciaInversor" DECIMAL(10,2) NOT NULL,
    "quantidadeModulo" INTEGER NOT NULL,
    "quantidadeInversore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteId" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "inversorId" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "acessoId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "projeto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tecnico_cpf_key" ON "tecnico"("cpf");

-- AddForeignKey
ALTER TABLE "acesso" ADD CONSTRAINT "acesso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tecnico" ADD CONSTRAINT "tecnico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stringBoxCC" ADD CONSTRAINT "stringBoxCC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stringBoxCA" ADD CONSTRAINT "stringBoxCA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_inversorId_fkey" FOREIGN KEY ("inversorId") REFERENCES "inversor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "tecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_acessoId_fkey" FOREIGN KEY ("acessoId") REFERENCES "acesso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto" ADD CONSTRAINT "projeto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modulo" ADD CONSTRAINT "modulo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inversor" ADD CONSTRAINT "inversor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
