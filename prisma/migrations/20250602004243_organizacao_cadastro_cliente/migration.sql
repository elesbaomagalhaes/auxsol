-- AlterTable
ALTER TABLE "cliente" ADD COLUMN     "fotoMedidor" TEXT,
ADD COLUMN     "fotoRG" TEXT,
ALTER COLUMN "numProjeto" DROP NOT NULL;
