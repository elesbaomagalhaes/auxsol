/*
  Warnings:

  - Added the required column `email` to the `PasswordResetCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordResetCode" ADD COLUMN     "email" TEXT NOT NULL;
