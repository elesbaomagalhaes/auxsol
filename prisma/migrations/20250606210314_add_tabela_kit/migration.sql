-- CreateTable
CREATE TABLE "kit" (
    "id" TEXT NOT NULL,
    "numProjeto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "qtd" DECIMAL(10,2) NOT NULL,
    "potenciaGerador" DECIMAL(10,2) NOT NULL,
    "potenciaInversor" DECIMAL(10,2) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "kit" ADD CONSTRAINT "kit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit" ADD CONSTRAINT "kit_numProjeto_fkey" FOREIGN KEY ("numProjeto") REFERENCES "cliente"("numProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;
