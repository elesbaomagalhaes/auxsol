import { z } from "zod";

export const stringBoxCCSchema = z.object({
  fabricante: z.string().min(1, { message: "Fabricante é obrigatório" }),
  modelo: z.string().min(1, { message: "Modelo é obrigatório" }),
  numeroEntradas: z.coerce
    .number()
    .int({ message: "Número de entradas deve ser um número inteiro" })
    .min(1, { message: "Número de entradas deve ser maior que zero" }),
  numeroSaidas: z.coerce
    .number()
    .int({ message: "Número de saídas deve ser um número inteiro" })
    .min(1, { message: "Número de saídas deve ser maior que zero" }),
  tensaoMaxOperacao: z.string().min(1, { message: "Tensão máxima de operação é obrigatória" }),
  correnteMaxOperacao: z.string().min(1, { message: "Corrente máxima de operação é obrigatória" }),
  classeDps: z.string().min(1, { message: "Classe DPS é obrigatória" }),
  nivelProtecao: z.string().min(1, { message: "Nível de proteção é obrigatório" }),
  correnteNominalDescarga: z.string().min(1, { message: "Corrente nominal de descarga é obrigatória" }),
  correnteMaxDescarga: z.string().min(1, { message: "Corrente máxima de descarga é obrigatória" }),
  numeroPoloSeccionadora: z.coerce
    .number()
    .int({ message: "Número de polos da seccionadora deve ser um número inteiro" })
    .min(1, { message: "Número de polos da seccionadora deve ser maior que zero" }),
  grauProtecao: z.string().min(1, { message: "Grau de proteção é obrigatório" }),
});

export type StringBoxCCSchema = z.infer<typeof stringBoxCCSchema>;
export default stringBoxCCSchema;