
import { z } from "zod"

// Personal Information Schema
export const clienteSchema = z.object({
    nome: z.string().min(10, "O nome deve ser completo"),
    rgCnh: z.string().min(5, "Digite um CPF/CNPJ válido"),
    cpf: z.string().min(11, "CPF/CNPJ inválido"),
    rgCnhDataEmissao: z.string()
      .min(1, "Data de emissão é obrigatória")
      .refine((date) => {
        if (!date) return false;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime()) && parsedDate <= new Date();
      }, "Data de emissão deve ser uma data válida e não pode ser futura"),
    fone: z.string().min(10, "Telefone inválido"),
    email: z.string().email("E-mail inválido"),
    numProjetoC: z.string()
      .min(5, "Digite um código válido")
      .max(20, "Número do projeto deve ter no máximo 20 caracteres")
      .regex(/^[A-Za-z0-9-_]+$/, "Número do projeto deve conter apenas letras, números, hífens e underscores"),
    rua: z.string().min(3, "Rua é obrigatória"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Indique o bairro"),
    cidade: z.string().min(2, "Indique a cidade"),
    uf: z.string().length(2, "Indique o estado"),
    cep: z.string().length(9, "CEP deve ter 9 dígitos")
})

// Contact Information Schema
export const acessoSchema = z.object({
    concessionaria: z.string().min(3, "Concessionária é obrigatório"),
    contractNumber: z.string().min(5, "C.Contrato é obrigatório"),
    tensaoRede: z.string().min(2, "Campo é obrigatório"),
    subgrupoConexao: z.string().min(1, "Campo é obrigatório"),
    tipoConexao: z.string().min(1, "Campo obrigatório"),
    tipoSolicitacao: z.string().min(1, "Campo é obrigatório"),
    tipoRamal: z.string().min(2, "escolha o ramal"),
    ramoAtividade: z.string().min(1, "Campo é obrigatório"),
    enquadramentoGeracao: z.string().min(1, "Campo é obrigatório"),
    tipoGeracao: z.string().min(2, "Campo obrigatório"),
    alocacaoCredito: z.string().min(1, "Campo é obrigatório"),
    poste: z.string().optional(),
    latitudeUTM: z.string().min(5, "Latitude inválida"),
    longitudeUTM: z.string().min(5, "Longitude inválida")
})

// Kit Schema - Alinhado com o modelo kit do schema.prisma e estrutura do frontend
export const equipamentoKitSchema = z.object({
  tipo: z.string().min(1, "Tipo é obrigatório"), // Campo obrigatório
  itemId: z.string().min(1, "Item ID é obrigatório"), // Campo obrigatório
  quantidade: z.number().min(1, "Quantidade deve ser maior que zero").optional(), // Campo usado pelo frontend
  qtd: z.number().min(1, "Quantidade deve ser maior que zero").optional(), // Campo do schema do banco
  stringSelecionada: z.string().optional(), // Campo usado pelo frontend
  string: z.number().optional(), // Campo do schema do banco
  potencia: z.number().optional(), // Campo genérico usado pelo frontend
  potenciaGerador: z.number().optional(),
  potenciaInversor: z.number().optional(),
  fabricante: z.string().nullable().optional(), // Campo do equipamento
  modelo: z.string().nullable().optional(), // Campo do equipamento
  mppt: z.number().nullable().optional() // Campo do equipamento
}).refine((data) => {
  // Pelo menos um dos campos de quantidade deve estar presente
  return (data.quantidade && data.quantidade > 0) || (data.qtd && data.qtd > 0);
}, {
  message: "Quantidade é obrigatória e deve ser maior que zero",
  path: ["quantidade"]
})

// Techinic Schema
export const tecnicoSchema = z.object({
    nomeT: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    registro: z.string().min(5, "CREA/CFT é obrigatório"),
    rgCnhT: z.string().min(5, "CREA/CFT é obrigatório"),
    cpfT: z.string().min(11, "CPF/CNPJ inválido"),
    foneT: z.string().min(10, "Telefone inválido"),
    tipoProfissional: z.string().min(2,"Escolha uma profissão"),
    tpoPrfInfo: z.string().optional(),
    emailT: z.string().email("E-mail inválido"),
      logradouroT: z.string().min(3, "Rua é obrigatória"),
      numeroT: z.string().min(1, "Número é obrigatório"),
      complementoT: z.string().optional(),
      bairroT: z.string().min(2, "Bairro é obrigatório"),
      cidadeT: z.string().min(2, "Cidade é obrigatória"),
      ufT: z.string().length(2, "Estado deve ter 2 caracteres"),
      cepT: z.string().min(8, "CEP deve ter 8 dígitos")
})


export const kitSchema = z.object({
  numProjeto: z.string()
    .min(5, "Digite um código válido")
    .max(20, "Número do projeto deve ter no máximo 20 caracteres")
    .regex(/^[A-Za-z0-9-_]+$/, "Número do projeto deve conter apenas letras, números, hífens e underscores"),
  potenciaGerador: z.number().min(0.01, "Potência do gerador deve ser maior que 0"),
  potenciaInversor: z.number().min(0.01, "Potência do inversor deve ser maior que 0"),
  equipamentos: z.array(equipamentoKitSchema).min(1, "Pelo menos um equipamento é obrigatório"),
  clienteCpf: z.string().min(11, "CPF do cliente é obrigatório"),
  tecnicoCpf: z.string().min(11, "CPF do técnico é obrigatório"),
  acessoCpf: z.string().min(11, "CPF do acesso é obrigatório"),
})

// Schema para edição de projeto
export const projetoEditSchema = z.object({
  numProjeto: z.string()
    .min(5, "Digite um código válido")
    .max(20, "Número do projeto deve ter no máximo 20 caracteres")
    .regex(/^[A-Za-z0-9-_]+$/, "Número do projeto deve conter apenas letras, números, hífens e underscores"),
  potenciaGerador: z.coerce.number().min(0.01, "Potência do gerador deve ser maior que 0"),
  potenciaInversor: z.coerce.number().min(0.01, "Potência do inversor deve ser maior que 0"),
  status: z.string().min(1, "Status é obrigatório"),
  clienteCpf: z.string().min(11, "CPF do cliente é obrigatório"),
  tecnicoCpf: z.string().min(11, "CPF do técnico é obrigatório"),
  acessoCpf: z.string().min(11, "CPF do acesso é obrigatório"),
})

export type ProjetoEditSchema = z.infer<typeof projetoEditSchema>

// Combined Form Schema
export const formSchema = z.object({
  ...clienteSchema.shape,
  ...acessoSchema.shape,
  ...tecnicoSchema.shape,
  equipamentosKit: z.array(equipamentoKitSchema).optional()
})

// Infer the type from the schema
export type FormData = z.infer<typeof formSchema>
