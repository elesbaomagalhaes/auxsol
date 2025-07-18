import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Função para validar e formatar entrada de números decimais
 * @param value Valor do input
 * @param decimalPlaces Número de casas decimais (padrão: 2)
 * @returns Valor formatado
 */
export function formatDecimalInput(value: string, decimalPlaces: number = 2): string {
  // Remove caracteres não numéricos exceto ponto
  let formattedValue = value.replace(/[^0-9.]/g, '');
  
  // Garante que só existe um ponto decimal
  const parts = formattedValue.split('.');
  if (parts.length > 2) {
    formattedValue = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limita ao número de casas decimais especificado
  if (parts.length > 1 && parts[1].length > decimalPlaces) {
    formattedValue = parts[0] + '.' + parts[1].substring(0, decimalPlaces);
  }
  return formattedValue;
}

/**
 * Função para formatar número com casas decimais fixas ao perder o foco
 * @param value Valor do input
 * @param decimalPlaces Número de casas decimais (padrão: 2)
 * @returns Valor formatado com casas decimais fixas ou valor original se inválido
 */
export function formatDecimalOnBlur(value: string, decimalPlaces: number = 2): string {
  if (value && !isNaN(parseFloat(value))) {
    return parseFloat(value).toFixed(decimalPlaces);
  }
  return value;
}

/**
 * Função para formatar data no formato brasileiro
 * @param date Data a ser formatada
 * @returns Data formatada no formato dd/mm/aaaa
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
}

/**
 * Função para calcular a geração mensal de energia solar
 * @param hsp Horas de Sol Pleno do mês
 * @param potenciaGeracao Potência de geração em Watts
 * @returns Geração mensal em kWh
 */
export function calcularGeracaoMensal(hsp: number, potenciaGeracao: number): number {
  // Fórmula: HSP × 30 dias × (potência de geração / 1000) × Perdas
  const geracao = hsp * 30 * (potenciaGeracao / 1000) * 0.80;
  return parseFloat(geracao.toFixed(2));
}

/**
 * Função para calcular a geração de todos os meses
 * @param hspMensais Array com HSP de cada mês (12 valores)
 * @param potenciaGeracao Potência de geração em Watts
 * @returns Array com geração mensal de cada mês em kWh
 */
export function calcularGeracaoAnual(hspMensais: number[], potenciaGeracao: number): number[] {
  return hspMensais.map(hsp => calcularGeracaoMensal(hsp, potenciaGeracao));
}

// Tipos para parametrização
export type TipoLigacao = 'monofásico' | 'trifásico';

export interface ResultadoParametrizacao {
  disjuntor: {
    corrente: number;
    tipo: string;
  };
  condutor: {
    secao: number;
    fases: string;
  };
}

/**
 * Lista de disjuntores disponíveis (em amperes)
 */
const DISJUNTORES = [20, 25, 32, 40, 50, 63, 70, 80, 100, 125];

/**
 * Lista de seções de condutores disponíveis (em mm²)
 */
const SECOES_CONDUTORES = [4, 6, 10, 16, 25, 35, 50, 70];

/**
 * Capacidade de corrente por seção para ligação monofásica (em amperes)
 */
const CAPACIDADE_MONOFASICA: Record<number, number> = {
  4: 32,
  6: 41,
  10: 57,
  16: 76,
  25: 101,
  35: 125,
  50: 151,
  70: 192
};

/**
 * Capacidade de corrente por seção para ligação trifásica (em amperes)
 */
const CAPACIDADE_TRIFASICA: Record<number, number> = {
  4: 28,
  6: 36,
  10: 50,
  16: 68,
  25: 89,
  35: 110,
  50: 134,
  70: 171
};

/**
 * Fatores de correção
 */
const FATORES_CORRECAO = {
  temperatura: 0.94,
  agrupamento: {
    monofasico: 0.65,
    trifasico: 0.85
  }
};

/**
 * Escolhe o disjuntor mais próximo acima da corrente nominal
 * @param correnteNominal Corrente nominal do inversor em amperes
 * @returns Corrente do disjuntor escolhido
 */
export function escolherDisjuntor(correnteNominal: number): number {
  const disjuntorEscolhido = DISJUNTORES.find(disjuntor => disjuntor > correnteNominal);
  if (!disjuntorEscolhido) {
    throw new Error('Corrente nominal muito alta para os disjuntores disponíveis');
  }
  return disjuntorEscolhido;
}

/**
 * Calcula a corrente corrigida aplicando fatores de correção
 * @param correnteNominal Corrente nominal do inversor
 * @param tipoLigacao Tipo de ligação (monofásico ou trifásico)
 * @returns Corrente corrigida
 */
export function calcularCorrenteCorrigida(correnteNominal: number, tipoLigacao: TipoLigacao): number {
  const fatorTemperatura = FATORES_CORRECAO.temperatura;
  const fatorAgrupamento = tipoLigacao === 'monofásico' 
    ? FATORES_CORRECAO.agrupamento.monofasico 
    : FATORES_CORRECAO.agrupamento.trifasico;
  
  return correnteNominal / (fatorTemperatura * fatorAgrupamento);
}

/**
 * Escolhe a seção do condutor baseada na corrente corrigida e tipo de ligação
 * @param correnteCorrigida Corrente corrigida
 * @param tipoLigacao Tipo de ligação
 * @returns Seção do condutor escolhida
 */
export function escolherSecaoCondutor(correnteCorrigida: number, tipoLigacao: TipoLigacao): number {
  const capacidades = tipoLigacao === 'monofásico' ? CAPACIDADE_MONOFASICA : CAPACIDADE_TRIFASICA;
  
  for (const secao of SECOES_CONDUTORES) {
    if (capacidades[secao] >= correnteCorrigida) {
      return secao;
    }
  }
  
  throw new Error('Corrente corrigida muito alta para as seções disponíveis');
}

/**
 * Função principal para parametrização
 * @param correnteNominal Corrente nominal do inversor
 * @param tipoLigacao Tipo de ligação
 * @returns Resultado da parametrização
 */
export function parametrizar(correnteNominal: number, tipoLigacao: TipoLigacao): ResultadoParametrizacao {
  // 1. Escolher disjuntor
  const disjuntorEscolhido = escolherDisjuntor(correnteNominal);
  
  // 2. Calcular corrente corrigida
  const correnteCorrigida = calcularCorrenteCorrigida(correnteNominal, tipoLigacao);
  
  // 3. Escolher seção do condutor
  const secaoEscolhida = escolherSecaoCondutor(correnteCorrigida, tipoLigacao);
  
  // 4. Validar sequência: corrente_do_inversor < disjuntor_escolhido < corrente_suportada_pela_secao
  const capacidades = tipoLigacao === 'monofásico' ? CAPACIDADE_MONOFASICA : CAPACIDADE_TRIFASICA;
  const correnteSuportada = capacidades[secaoEscolhida];
  
  if (!(correnteNominal < disjuntorEscolhido && disjuntorEscolhido < correnteSuportada)) {
    throw new Error('Sequência de proteção inválida');
  }
  
  return {
    disjuntor: {
      corrente: disjuntorEscolhido,
      tipo: tipoLigacao === 'monofásico' ? 'Monopolar' : 'Tripolar'
    },
    condutor: {
      secao: secaoEscolhida,
      fases: tipoLigacao === 'monofásico' ? '1 fase + 1 neutro' : '3 fases + 1 neutro'
    }
  };
}

/**
 * Calcula a potência baseada no tipo de conexão, tensão da rede e disjuntor padrão
 * @param tipoConexao Tipo de conexão ('monofásico' ou 'trifásico')
 * @param tensaoRede Tensão da rede em volts
 * @param disjuntorPadrao Corrente do disjuntor padrão em amperes
 * @returns Potência calculada em kW
 */
export function calcularPotencia(
  tipoConexao: string,
  tensaoRede: number,
  disjuntorPadrao: number
): number {
  if (tipoConexao === 'MONOFÁSICO') {
    // Fórmula monofásica: (tensão da rede × disjuntor de entrada) / 1000
    return (tensaoRede * disjuntorPadrao) / 1000;
  } else if (tipoConexao === 'TRIFÁSICO') {
    // Fórmula trifásica: (tensão da rede × corrente do disjuntor × raiz de 3) / 1000
    return (tensaoRede * disjuntorPadrao * Math.sqrt(3)) / 1000;
  } else {
    throw new Error('Tipo de conexão inválido. Use "monofásico" ou "trifásico".');
  }
}

/**
 * Interface para coordenadas UTM
 */
export interface CoordenadasUTM {
  easting: number;
  northing: number;
  fuso: number;
  hemisferio: 'N' | 'S';
}

/**
 * Converte coordenadas geográficas (longitude/latitude) para UTM
 * @param longitude Longitude em graus decimais
 * @param latitude Latitude em graus decimais
 * @returns Coordenadas UTM com fuso, easting e northing
 */
export function converterParaUTM(longitude: number, latitude: number): CoordenadasUTM {
  // Constantes para conversão UTM
  const a = 6378137.0; // Semi-eixo maior WGS84
  const f = 1 / 298.257223563; // Achatamento WGS84
  const k0 = 0.9996; // Fator de escala
  const e2 = 2 * f - f * f; // Primeira excentricidade ao quadrado
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  
  // Usar fuso 23 fixo
  const fuso = 23;
  
  // Meridiano central do fuso 23
  const longitudeCentral = (fuso - 1) * 6 - 180 + 3;
  
  // Converter para radianos
  const latRad = latitude * Math.PI / 180;
  const lonRad = longitude * Math.PI / 180;
  const lonCentralRad = longitudeCentral * Math.PI / 180;
  
  // Cálculos intermediários
  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const T = Math.tan(latRad) * Math.tan(latRad);
  const C = e2 * Math.cos(latRad) * Math.cos(latRad) / (1 - e2);
  const A = Math.cos(latRad) * (lonRad - lonCentralRad);
  
  const M = a * ((1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256) * latRad
    - (3*e2/8 + 3*e2*e2/32 + 45*e2*e2*e2/1024) * Math.sin(2*latRad)
    + (15*e2*e2/256 + 45*e2*e2*e2/1024) * Math.sin(4*latRad)
    - (35*e2*e2*e2/3072) * Math.sin(6*latRad));
  
  // Calcular coordenadas UTM
  const easting = k0 * N * (A + (1-T+C)*A*A*A/6 + (5-18*T+T*T+72*C-58*e2)*A*A*A*A*A/120) + 500000;
  
  let northing = k0 * (M + N*Math.tan(latRad)*(A*A/2 + (5-T+9*C+4*C*C)*A*A*A*A/24 + (61-58*T+T*T+600*C-330*e2)*A*A*A*A*A*A/720));
  
  // Ajustar para hemisfério sul
  if (latitude < 0) {
    northing += 10000000;
  }
  
  return {
    easting: Math.round(easting),
    northing: Math.round(northing),
    fuso: fuso,
    hemisferio: latitude >= 0 ? 'N' : 'S'
  };
}

/**
 * Converte coordenadas geográficas para UTM formatadas
 * @param longitude Longitude em graus decimais
 * @param latitude Latitude em graus decimais
 * @returns Coordenadas UTM formatadas
 */
export function converterCoordenadasParaUTM(longitude: number, latitude: number): { longitudeUTM: string; latitudeUTM: string } {
  const coordUTM = converterParaUTM(longitude, latitude);
  
  return {
    longitudeUTM: `${coordUTM.easting}`,
    latitudeUTM: `${coordUTM.northing}`
  };
}

/**
 * Verifica se deve retornar SIM ou NÃO baseado na potência do inversor e enquadramento de geração
 * @param enquadramentoGeracao Modalidade de enquadramento da geração
 * @param potenciaGerador Potência do inversor em kW
 * @returns 'SIM' se potência >= 7.5 e modalidade for autoconsumo local, caso contrário 'NÃO'
 */
export function verificarCriterioGeracao(enquadramentoGeracao: string | null | undefined, potenciaGerador: any): string {
  if (!enquadramentoGeracao || !potenciaGerador) {
    return 'NÃO';
  }
  
  try {
    const potencia = Number(potenciaGerador)/1000;
    if (isNaN(potencia)) {
      return 'NÃO';
    }
    
    const modalidadeNormalizada = enquadramentoGeracao.toLowerCase().trim();
    const isAutoconsumoLocal = modalidadeNormalizada.includes('autoconsumo local');
    const potenciaAtendeCriterio = potencia <= 7.5;
    
    return (isAutoconsumoLocal && potenciaAtendeCriterio) ? 'SIM' : 'NÃO';
  } catch (error) {
    return 'NÃO';
  }
}
