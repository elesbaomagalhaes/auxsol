import { z } from "zod";

export const protecaoCASchema = z.object({

  modelo: z.string().min(1, { message: "A potencia de saida" }),
  tensaoNomDisjuntor: z.string().min(1, { message: "A Tensão Nominal do Disjuntor deve ser um número positivo." }),
  correnteNomDisjuntor: z.string().min(1, { message: "A Corrente Nominal do Disjuntor deve ser um número positivo." }),
  frequenciaNomDisjuntor: z.string().min(1, { message: "A Frequência Nominal do Disjuntor deve ser um número positivo." }),
  elementoProtDisjuntor: z.string().min(1, { message: "preencha o campo" }),
  curvaDisjuntor: z.string().min(1, { message: "preencha o campo" }),
  numeroPoloDisjuntor: z.coerce.number().int({ message: "Número de polo deve ser um número inteiro" }).min(1, { message: "Número de polo deve ser maior que zero" }),
  classeDps: z.string().min(1, { message: "Classe DPS é obrigatória" }),
  correnteNomDPS: z.string().min(1, { message: "A Corrente Nominal do DPS deve ser um número positivo." }),
  correnteMaxDPS: z.string().min(1, { message: "A Corrente Máx do DPS deve ser um número positivo." }),
  numeroPoloDPS: z.coerce.number().int({ message: "Número de polos deve ser um número inteiro" }).min(1, { message: "Número de polos deve ser maior que zero" }),
  tensaoNomDPS: z.string().min(1, {message: "A Tensão Nominal do DPS deve ser um número positivo." })
});

export type ProtecaoCASchema = z.infer<typeof protecaoCASchema>;
export default protecaoCASchema;