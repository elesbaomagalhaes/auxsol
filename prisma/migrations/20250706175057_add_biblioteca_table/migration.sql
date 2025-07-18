-- CreateTable
CREATE TABLE "equipamento" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'a',
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "potencia" DECIMAL(8,2) NOT NULL,
    "fatorPotencia" DECIMAL(8,2) NOT NULL,
    "tensao" DECIMAL(8,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargaInstalada" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'a',
    "numProjeto" TEXT NOT NULL,
    "idEquipamento" TEXT NOT NULL,
    "qtd" DECIMAL(3,2) NOT NULL,
    "potenciaW" DECIMAL(8,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargaInstalada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biblioteca" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cloudinaryUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "tipoUsuario" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'a',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "biblioteca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biblioteca_tipo_categoria_idx" ON "biblioteca"("tipo", "categoria");

-- CreateIndex
CREATE INDEX "biblioteca_tipoUsuario_idx" ON "biblioteca"("tipoUsuario");

-- CreateIndex
CREATE INDEX "biblioteca_userId_idx" ON "biblioteca"("userId");

-- AddForeignKey
ALTER TABLE "cargaInstalada" ADD CONSTRAINT "cargaInstalada_numProjeto_fkey" FOREIGN KEY ("numProjeto") REFERENCES "projeto"("numProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
