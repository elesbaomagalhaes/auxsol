import { z } from "zod"

export const clienteSchema = z.object({
  nome: z.string().min(10, { message: "O nome deve ser completo" }),
  rgCnh: z.string().min(5, { message: "Digite um RG/CNH válido" }),
  rgCnhDataEmissao: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, { message: "Data de emissão é obrigatória" }),
  cpf: z.string().min(11, { message: "CPF/CNPJ inválido" }),
  fone: z.string().min(10, { message: "Telefone inválido" }),
  email: z.string().email({ message: "E-mail inválido" }),
  rua: z.string().min(3, { message: "Rua é obrigatória" }),
  numero: z.string().min(1, { message: "Número é obrigatório" }),
  complemento: z.string().optional(),
  numProjeto: z.string().optional(),
  bairro: z.string().min(2, { message: "Indique o bairro" }),
  cidade: z.string().min(2, { message: "Indique a cidade" }),
  uf: z.string().length(2, { message: "Indique o estado" }),
  cep: z.string().length(9, { message: "CEP deve ter 9 dígitos" })
})

export type ClienteSchema = z.infer<typeof clienteSchema>;
export default clienteSchema;