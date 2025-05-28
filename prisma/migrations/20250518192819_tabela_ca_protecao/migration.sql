/*
  Warnings:

  - You are about to drop the `stringBoxCA` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stringBoxCA" DROP CONSTRAINT "stringBoxCA_userId_fkey";

-- DropTable
DROP TABLE "stringBoxCA";

-- CreateTable
CREATE TABLE "protecaoCA" (
    "id" TEXT NOT NULL,
    "numeroPoloDisjuntor" INTEGER NOT NULL,
    "tensaoNomDisjuntor" TEXT NOT NULL,
    "correnteNomDisjuntor" TEXT NOT NULL,
    "frequenciaNomDisjuntor" TEXT NOT NULL,
    "elementoProtDisjuntor" TEXT NOT NULL,
    "correnteMaxDisjuntor" TEXT NOT NULL,
    "curvaAtuDisjuntor" TEXT NOT NULL,
    "classeDps" TEXT NOT NULL,
    "nivelProtecaoDPS" TEXT NOT NULL,
    "correnteNomDPS" TEXT NOT NULL,
    "correnteMaxDPS" TEXT NOT NULL,
    "numeroPoloDPS" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "protecaoCA_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "protecaoCA" ADD CONSTRAINT "protecaoCA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
