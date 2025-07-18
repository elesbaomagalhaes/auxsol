/*
  Warnings:

  - A unique constraint covering the columns `[numProjeto]` on the table `projeto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projeto_numProjeto_key" ON "projeto"("numProjeto");
