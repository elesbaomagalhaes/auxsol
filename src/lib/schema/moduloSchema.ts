import * as z from "zod";

/**
 * Schema de validação para o formulário de cadastro de módulos fotovoltaicos
 */
export const moduloFormSchema = z.object({
  modelo: z.string().min(1, "O modelo é obrigatório"),
  fabricante: z.string().min(1, "O fabricante é obrigatório"), // Adicionado conforme schema.prisma
  potenciaNominal: z.coerce.number({
    required_error: "A potência nominal é obrigatória",
    invalid_type_error: "A potência nominal deve ser um número",
  }).positive("A potência nominal deve ser positiva"),
  tensaoCircAberto: z.string().min(1, "A tensão de circuito aberto é obrigatória"),
  correnteCurtCirc: z.string().min(1, "A corrente de curto circuito é obrigatória"),
  tensaoMaxOper: z.coerce.number({
    required_error: "A tensão de máxima operação é obrigatória",
    invalid_type_error: "A tensão de máxima operação deve ser um número",
  }).positive("A tensão de máxima operação deve ser positiva"),
  correnteMaxOper: z.coerce.number({
    required_error: "A corrente de máxima operação é obrigatória",
    invalid_type_error: "A corrente de máxima operação deve ser um número",
  }).positive("A corrente de máxima operação deve ser positiva"),
  eficiencia: z.string().min(1, "A eficiência é obrigatória"),
  datasheet: z.string().optional(), // No schema.prisma é String, não opcional
  seloInmetro: z.string().optional(),
  comprimento: z.coerce.number({
    required_error: "O comprimento é obrigatório",
    invalid_type_error: "O comprimento deve ser um número",
  }).positive("O comprimento deve ser positivo"),
  largura: z.coerce.number({
    required_error: "A largura é obrigatória",
    invalid_type_error: "A largura deve ser um número",
  }).positive("A largura deve ser positiva"),
  area: z.coerce.number({
    required_error: "A área é obrigatória",
    invalid_type_error: "A área deve ser um número",
  }).positive("A área deve ser positiva"),
  peso: z.coerce.number({
    required_error: "O peso é obrigatório",
    invalid_type_error: "O peso deve ser um número",
  }).positive("O peso deve ser positivo"),
});

export type ModuloSchema = z.infer<typeof moduloFormSchema>;
export default moduloFormSchema;