/*
  Warnings:

  - You are about to drop the column `categoria` on the `biblioteca` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinaryPublicId` on the `biblioteca` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinaryUrl` on the `biblioteca` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `biblioteca` table. All the data in the column will be lost.
  - You are about to drop the column `tipoUsuario` on the `biblioteca` table. All the data in the column will be lost.
  - Added the required column `url` to the `biblioteca` table without a default value. This is not possible if the table is not empty.
  - Made the column `descricao` on table `biblioteca` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "biblioteca" DROP CONSTRAINT "biblioteca_userId_fkey";

-- DropIndex
DROP INDEX "biblioteca_tipoUsuario_idx";

-- DropIndex
DROP INDEX "biblioteca_tipo_categoria_idx";

-- DropIndex
DROP INDEX "biblioteca_userId_idx";

-- AlterTable
ALTER TABLE "biblioteca" DROP COLUMN "categoria",
DROP COLUMN "cloudinaryPublicId",
DROP COLUMN "cloudinaryUrl",
DROP COLUMN "nome",
DROP COLUMN "tipoUsuario",
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "descricao" SET NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
