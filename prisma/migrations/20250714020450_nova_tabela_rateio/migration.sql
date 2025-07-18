-- AlterTable
ALTER TABLE "acesso" ALTER COLUMN "alocacaoCredito" DROP NOT NULL;

-- CreateTable
CREATE TABLE "rateio" (
    "id" TEXT NOT NULL,
    "status" TEXT DEFAULT 'a',
    "numProjeto" TEXT NOT NULL,
    "ccontrato" TEXT NOT NULL,
    "classConsumo" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rateio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rateio" ADD CONSTRAINT "rateio_numProjeto_fkey" FOREIGN KEY ("numProjeto") REFERENCES "acesso"("numProjeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rateio" ADD CONSTRAINT "rateio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
