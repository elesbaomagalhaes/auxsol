-- Unificar registros duplicados na tabela cargaInstalada
-- Agrupa por numProjeto e idEquipamento, somando as quantidades

-- Criar tabela temporária com dados unificados
CREATE TEMP TABLE carga_unificada AS
SELECT 
    MIN(id) as id_manter,
    "numProjeto",
    "idEquipamento",
    SUM(qtd) as qtd_total,
    AVG("potenciaW") as "potenciaW",
    MIN("createdAt") as "createdAt",
    MAX("updatedAt") as "updatedAt",
    MIN(status) as status
FROM "cargaInstalada"
GROUP BY "numProjeto", "idEquipamento";

-- Deletar todos os registros da tabela original
DELETE FROM "cargaInstalada";

-- Inserir os dados unificados de volta
INSERT INTO "cargaInstalada" (id, status, "numProjeto", "idEquipamento", qtd, "potenciaW", "createdAt", "updatedAt")
SELECT 
    id_manter,
    status,
    "numProjeto",
    "idEquipamento",
    qtd_total,
    "potenciaW",
    "createdAt",
    "updatedAt"
FROM carga_unificada;