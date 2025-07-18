import { z } from "zod";

export const inversorSchema = z.object({
  fabricante: z.string().min(1, { message: "Fabricante é obrigatório" }),
  modelo: z.string().min(1, { message: "Modelo é obrigatório" }),
  potenciaNomEnt: z.coerce.number().min(0.01, { message: "Potência nominal de entrada deve ser maior que 0" }),
  potenciaMaxEnt: z.coerce.number().min(0.01, { message: "Potência máxima de entrada deve ser maior que 0" }),
  tensaoMaxEnt: z.string().min(1, { message: "Tensão máxima de entrada é obrigatória" }),
  tensaoInic: z.string().min(1, { message: "Tensão de inicialização é obrigatória" }),
  tensaoNomEnt: z.string().min(1, { message: "Tensão nominal de entrada é obrigatória" }),
  numeroEntMPPT: z.coerce.number().int().min(1, { message: "Número de entradas MPPT deve ser pelo menos 1" }),
  potenciaMaxMPPT: z.string().min(1, { message: "Potência máxima MPPT é obrigatória" }),
  correnteMaxEnt: z.string().min(1, { message: "Corrente máxima de entrada é obrigatória" }),
  correnteMaxCurtCirc: z.string().min(1, { message: "Corrente máxima de curto-circuito é obrigatória" }),
  potenciaNomSai: z.coerce.number().min(0.01, { message: "Potência nominal de saída deve ser maior que 0" }),
  potenciaMaxSai: z.coerce.number().min(0.01, { message: "Potência máxima de saída deve ser maior que 0" }),
  correnteNomSai: z.string().min(1, { message: "Corrente nominal de saída é obrigatória" }),
  correnteMaxSai: z.string().min(1, { message: "Corrente máxima de saída é obrigatória" }),
  tensaoNomSai: z.string().min(1, { message: "Tensão nominal de saída é obrigatória" }),
  THD: z.string().min(1, { message: "THD é obrigatório" }),
  frequenciaNom: z.string().min(1, { message: "Frequência nominal é obrigatória" }),
  fatorPotencia: z.coerce.number().min(0.01, { message: "Fator de Potência deve ser maior que 0" }),
  tensaoMaxsSai: z.string().min(1, { message: "Tensão máxima de saída é obrigatória" }),
  tensaoMinSai: z.string().min(1, { message: "Tensão mínima de saída é obrigatória" }),
  eficiencia: z.coerce
  .number()
  .min(0.01, { message: "Eficiencia deve ser maior que 0" }),
  tipoInv: z.string().min(1, {message: "Tipo de inversor é obrigatório"}),
});

export type InversorSchema = z.infer<typeof inversorSchema>;
