import { Decimal, DynamicModelExtensionFnResultNull } from "@prisma/client/runtime/library";

// Definindo o tipo para os dados da StringBoxCC
export type StringBoxCC = {
  id: string;
  fabricante: string;
  modelo: string;
  numeroEntradas: number;
  numeroSaidas: number;
  tensaoMaxOperacao: string;
  correnteMaxOperacao: string;
  classeDps: string;
  nivelProtecao: string;
  correnteNominalDescarga: string;
  correnteMaxDescarga: string;
  numeroPoloSeccionadora: number;
  grauProtecao: string;
};

export type ProtecaoCA = {
  id: string,
  modelo: string,
  numeroPoloDisjuntor: number,
  tensaoNomDisjuntor: string,
  correnteNomDisjuntor: string,
  frequenciaNomDisjuntor: string,
  elementoProtDisjuntor: string,
  curvaDisjuntor: string,
  classeDps: string,
  correnteNomDPS: string,
  correnteMaxDPS: string,
  tensaoNomDPS: string,
  numeroPoloDPS: number
};

export type Inversor = {
  id: string,
  fabricante: string,
  modelo: string,
  potenciaNomEnt: number,
  potenciaMaxEnt: number,
  tensaoMaxEnt: string,
  tensaoInic: string,
  tensaoNomEnt: string,
  numeroEntMPPT: number,
  potenciaMaxMPPT: string,
  correnteMaxEnt: string,
  correnteMaxCurtCirc: string,
  potenciaNomSai: number,
  potenciaMaxSai: number,
  correnteNomSai: string,
  correnteMaxSai: string,
  tensaoNomSai: string,
  THD: string,
  tipoInv: string,
  frequenciaNom: string,
  fatorPotencia: number,
  tensaoMaxsSai: string,
  tensaoMinSai: string,
  eficiencia: number,
}

export type Modulo = {
  id: string,
  fabricante: string,
  modelo: string,
  potenciaNominal: number,
  tensaoCircAberto: string,
  correnteCurtCirc: string,
  tensaoMaxOper: number,
  correnteMaxOper: number,
  eficiencia: string,
  datasheet: string,
  seloInmetro: string,
  comprimento: number,
  largura: number,
  area: number,
  peso: number,
}