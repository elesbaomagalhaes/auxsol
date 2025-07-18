import { z } from "zod"

export const tecnicoSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  registro: z.string().min(5, { message: "Registro CREA/CFT é obrigatório" }),
  rgCnh: z.string().min(5, { message: "RG/CNH é obrigatório" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  fone: z.string().min(10, { message: "Telefone inválido" }),
  email: z.string().email({ message: "E-mail inválido" }),
  tipoProfissional: z.string().min(1, { message: "Tipo profissional é obrigatório" }),
  logradouro: z.string().min(3, { message: "Logradouro é obrigatório" }),
  numero: z.string().min(1, { message: "Número é obrigatório" }),
  complemento: z.string().optional(),
  bairro: z.string().min(2, { message: "Bairro é obrigatório" }),
  cidade: z.string().min(2, { message: "Cidade é obrigatória" }),
  uf: z.string().length(2, { message: "UF deve ter 2 caracteres" }),
  cep: z.string().min(8, { message: "CEP deve ter 8 dígitos" })
})

export type TecnicoSchema = z.infer<typeof tecnicoSchema>
export default tecnicoSchema