-- AddForeignKey
ALTER TABLE "cargaInstalada" ADD CONSTRAINT "cargaInstalada_idEquipamento_fkey" FOREIGN KEY ("idEquipamento") REFERENCES "equipamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
