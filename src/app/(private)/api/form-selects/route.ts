import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Primeiro tenta o arquivo do public
    let filePath = path.join(process.cwd(), 'public', 'data', 'form-selects.json');
    
    if (!fs.existsSync(filePath)) {
      // Se não existir, tenta o arquivo do src
      filePath = path.join(process.cwd(), 'src', 'data', 'form-selects.json');
    }
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo form-selects.json não encontrado');
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Normaliza os dados para garantir consistência e ordena alfabeticamente
    const normalizeData = (items: any[]) => {
      return items.map((item: any) => ({
        ...item,
        descricao: item.descricao || item.nome
      })).sort((a, b) => a.descricao.localeCompare(b.descricao));
    };
    
    const normalizedData = {
      tensaoRede: normalizeData(data.tensaoRede || []),
      subgrupoConexao: normalizeData(data.subgrupoConexao || data.grupoConexao || []),
      tipoConexao: normalizeData(data.tipoConexao || []),
      tipoSolicitacao: normalizeData(data.tipoSolicitacao || []),
      tipoRamal: normalizeData(data.tipoRamal || []),
      ramoAtividade: normalizeData(data.ramoAtividade || []),
      enquadramentoGeracao: normalizeData(data.enquadramentoGeracao || []),
      tipoGeracao: normalizeData(data.tipoGeracao || []),
      alocacaoCredito: normalizeData(data.alocacaoCredito || [])
    };
    
    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error('Erro ao carregar form-selects:', error);
    
    // Fallback com dados estáticos ordenados alfabeticamente
    const fallbackData = {
      tensaoRede: [
        { id: 1, sigla: "127V", descricao: "127 V" },
        { id: 2, sigla: "220V", descricao: "220 V" },
        { id: 3, sigla: "380V", descricao: "380 V" },
        { id: 4, sigla: "440V", descricao: "440 V" }
      ],
      subgrupoConexao: [
        { id: 1, sigla: "B1", descricao: "B1" },
        { id: 2, sigla: "B2", descricao: "B2" },
        { id: 3, sigla: "B3", descricao: "B3" },
        { id: 4, sigla: "B4", descricao: "B4" }
      ],
      tipoConexao: [
        { id: 2, sigla: "BI", descricao: "BIFÁSICO" },
        { id: 1, sigla: "MONO", descricao: "MONOFÁSICO" },
        { id: 3, sigla: "TRI", descricao: "TRIFÁSICO" }
      ],
      tipoSolicitacao: [
        { id: 4, sigla: "AUMENTO_GD_EXISTENTE", descricao: "AUMENTO DA POTÊNCIA DE GERAÇÃO EM UC COM GD EXISTENTE" },
        { id: 2, sigla: "GD_SEM_AUMENTO", descricao: "CONEXÃO DE GD EM UNIDADE CONSUMIDORA EXISTENTE SEM AUMENTO DE POTÊNCIA DISPONIBILIZADA" },
        { id: 3, sigla: "GD_COM_AUMENTO", descricao: "CONEXÃO DE GD EM UNIDADE CONSUMIDORA EXISTENTE COM AUMENTO DE POTÊNCIA DISPONIBILIZADA" },
        { id: 1, sigla: "LNUC_GD", descricao: "LIGAÇÃO NOVA DE UNIDADE CONSUMIDORA COM GERAÇÃO DISTRIBUÍDA" }
      ],
      tipoRamal: [
        { id: 1, sigla: "AER", descricao: "AÉREO" },
        { id: 2, sigla: "SUB", descricao: "SUBTERRÂNEO" }
      ],
      ramoAtividade: [
        { id: 2, sigla: "COM", descricao: "COMERCIAL" },
        { id: 3, sigla: "IND", descricao: "INDUSTRIAL" },
        { id: 1, sigla: "RES", descricao: "RESIDENCIAL" },
        { id: 4, sigla: "RUR", descricao: "RURAL" },
        { id: 5, sigla: "PUB", descricao: "SERVIÇO PÚBLICO" }
      ],
      enquadramentoGeracao: [
        { id: 2, sigla: "mini", descricao: "Minigeração (75 kW a 5 MW)" },
        { id: 1, sigla: "micro", descricao: "Microgeração (até 75 kW)" },
        { id: 3, sigla: "pequena", descricao: "Pequena Central (5 MW a 30 MW)" }
      ],
      tipoGeracao: [
        { id: 4, sigla: "biomassa", descricao: "Biomassa" },
        { id: 5, sigla: "biogas", descricao: "Biogás" },
        { id: 2, sigla: "eolica", descricao: "Eólica" },
        { id: 3, sigla: "hidrica", descricao: "Hídrica" },
        { id: 1, sigla: "solar", descricao: "Solar Fotovoltaica" }
      ],
      alocacaoCredito: [
        { id: 1, sigla: "ORDEM_PRIORIDADE", descricao: "Ordem de Prioridade" },
        { id: 2, sigla: "PERCENTUAL_EXCEDENTE", descricao: "Percentual do Excedente" }
      ]
    };
    
    return NextResponse.json(fallbackData);
  }
}
