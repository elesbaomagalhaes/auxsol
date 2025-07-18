-- CreateTable
CREATE TABLE "concessionaria" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'a',
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "normaTecnica" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concessionaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uf" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'a',
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uf_pkey" PRIMARY KEY ("id")
);
